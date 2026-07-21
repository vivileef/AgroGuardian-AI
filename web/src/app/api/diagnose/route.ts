import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/server/auth";
import { getConfig } from "@/lib/server/config";
import { getCaseStore } from "@/lib/server/demo-data";
import { runDiagnosisPipeline } from "@/lib/server/orchestrator";
import { getAdminClient, saveDetection } from "@/lib/server/supabase-admin";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { userId, error } = await requireUserId();
  if (error || !userId) return error!;

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ detail: "Debes subir una imagen." }, { status: 400 });
  }

  const crop = form.get("crop")?.toString() || null;
  const cropId = form.get("crop_id")?.toString() || null;
  const farmId = form.get("farm_id")?.toString() || null;
  const latRaw = form.get("lat")?.toString();
  const lonRaw = form.get("lon")?.toString();
  const bytes = Buffer.from(await file.arrayBuffer());

  if (bytes.length < 100) {
    return NextResponse.json({ detail: "Imagen vacía o inválida." }, { status: 400 });
  }
  if (bytes.length > 12 * 1024 * 1024) {
    return NextResponse.json({ detail: "Imagen demasiado grande (máx 12MB)." }, { status: 400 });
  }

  const cfg = getConfig();
  const mime = file.type || "image/jpeg";

  try {
    const result = await runDiagnosisPipeline(cfg, bytes, {
      mime,
      cropHint: crop,
      lat: latRaw ? Number(latRaw) : null,
      lon: lonRaw ? Number(lonRaw) : null,
    });

    result.crop_id = cropId;
    result.farm_id = farmId;

    getCaseStore().set(result.id, result);

    const client = getAdminClient(cfg);
    if (client) {
      try {
        const id = await saveDetection(client, userId, result, {
          crop_id: cropId,
          farm_id: farmId,
        });
        result.id = id;
        getCaseStore().set(result.id, result);
      } catch {
        /* DB optional */
      }
    }

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { detail: e instanceof Error ? e.message : "Error al analizar" },
      { status: 500 }
    );
  }
}
