import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireUserId } from "@/lib/server/auth";
import { getConfig } from "@/lib/server/config";
import { getCropStore, getFarmStore, isDbMissingError } from "@/lib/server/demo-data";
import { createCrop, getAdminClient, listCrops, listFarms } from "@/lib/server/supabase-admin";

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
      crops = dbCrops.length ? dbCrops : [];
    } catch (e) {
      if (!isDbMissingError(e)) {
        /* keep demo store */
      }
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

  const input = {
    farm_id: farmId,
    name,
    variety: String(body.variety ?? ""),
    growth_stage: String(body.growth_stage ?? "Desarrollo"),
    hectares: Number(body.hectares ?? 1),
    plot_id: body.plot_id ? String(body.plot_id) : null,
  };

  const cfg = getConfig();
  const client = getAdminClient(cfg);
  if (client) {
    try {
      const crop = await createCrop(client, userId, input);
      return NextResponse.json(crop, { status: 201 });
    } catch (e) {
      if (!isDbMissingError(e)) {
        return NextResponse.json(
          { detail: e instanceof Error ? e.message : "No se pudo crear el cultivo" },
          { status: 500 }
        );
      }
    }
  }

  const farms = getFarmStore();
  let ownsFarm = farms.some((f) => f.id === farmId);
  if (!ownsFarm && client) {
    try {
      const dbFarms = await listFarms(client, userId);
      ownsFarm = dbFarms.some((f) => f.id === farmId);
    } catch {
      /* ignore */
    }
  }
  if (!ownsFarm) {
    return NextResponse.json({ detail: "farm_id no existe" }, { status: 400 });
  }

  const crop = {
    id: randomUUID(),
    farm_id: farmId,
    name,
    variety: input.variety,
    growth_stage: input.growth_stage,
    stage: input.growth_stage,
    health_pct: 90,
    health: 90,
    status: "sano" as const,
    hectares: input.hectares,
  };
  getCropStore().push(crop);
  return NextResponse.json(crop, { status: 201 });
}
