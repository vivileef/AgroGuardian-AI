import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireUserId } from "@/lib/server/auth";
import { getConfig } from "@/lib/server/config";
import { getCropStore, getFarmStore, isDbMissingError } from "@/lib/server/demo-data";
import { getAdminClient, listCrops } from "@/lib/server/supabase-admin";

export async function GET(req: NextRequest) {
  const { userId, error } = await requireUserId();
  if (error || !userId) return error!;

  const farmId = req.nextUrl.searchParams.get("farm_id");
  const cfg = getConfig();
  const client = getAdminClient(cfg);

  let crops = getCropStore();
  if (client) {
    try {
      const dbCrops = await listCrops(client, userId);
      if (dbCrops.length) crops = dbCrops as typeof crops;
    } catch (e) {
      if (!isDbMissingError(e)) crops = getCropStore();
    }
  }

  if (farmId) {
    crops = crops.filter((c) => c.farm_id === farmId);
  }

  return NextResponse.json(crops);
}

export async function POST(req: NextRequest) {
  const { userId, error } = await requireUserId();
  if (error || !userId) return error!;

  const body = await req.json();
  const farmId = String(body.farm_id ?? "");
  const name = String(body.name ?? "").trim();
  if (!farmId || !name) {
    return NextResponse.json({ detail: "farm_id y name son requeridos" }, { status: 400 });
  }

  const farms = getFarmStore();
  if (!farms.some((f) => f.id === farmId)) {
    return NextResponse.json({ detail: "farm_id no existe" }, { status: 400 });
  }

  const crop = {
    id: randomUUID(),
    farm_id: farmId,
    name,
    variety: String(body.variety ?? ""),
    growth_stage: String(body.growth_stage ?? "Desarrollo"),
    stage: String(body.growth_stage ?? "Desarrollo"),
    health_pct: 90,
    health: 90,
    status: "sano" as const,
    hectares: Number(body.hectares ?? 1),
  };

  getCropStore().push(crop);
  return NextResponse.json(crop, { status: 201 });
}
