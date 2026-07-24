import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireUserId } from "@/lib/server/auth";
import { getConfig } from "@/lib/server/config";
import { getFarmStore, getPlotStore, isDbMissingError } from "@/lib/server/demo-data";
import {
  createPlot,
  getAdminClient,
  listPlots,
} from "@/lib/server/supabase-admin";

function errorDetail(e: unknown) {
  if (e instanceof Error) return e.message;
  if (typeof e === "object" && e && "message" in e) {
    return String((e as { message: unknown }).message);
  }
  return "No se pudo guardar el lote";
}

export async function GET(req: NextRequest) {
  const { userId, error } = await requireUserId();
  if (error || !userId) return error!;

  const farmId = req.nextUrl.searchParams.get("farm_id");
  const cfg = getConfig();
  const client = getAdminClient(cfg);
  const memory = getPlotStore();

  if (!client) {
    const plots = farmId ? memory.filter((p) => p.farm_id === farmId) : memory;
    return NextResponse.json(plots);
  }

  try {
    let plots = await listPlots(client, userId);
    if (!plots.length && memory.length) plots = memory;
    else if (memory.length) {
      const ids = new Set(plots.map((p) => p.id));
      plots = [...plots, ...memory.filter((p) => !ids.has(p.id))];
    }
    if (farmId) plots = plots.filter((p) => p.farm_id === farmId);
    return NextResponse.json(plots);
  } catch (e) {
    if (isDbMissingError(e)) {
      const plots = farmId ? memory.filter((p) => p.farm_id === farmId) : memory;
      return NextResponse.json(plots);
    }
    return NextResponse.json(farmId ? memory.filter((p) => p.farm_id === farmId) : memory);
  }
}

export async function POST(req: NextRequest) {
  const { userId, error } = await requireUserId();
  if (error || !userId) return error!;

  const body = await req.json();
  const farmId = String(body.farm_id ?? "");
  const name = String(body.name ?? "").trim();
  if (!farmId || !name) {
    return NextResponse.json({ detail: "farm_id y name requeridos" }, { status: 400 });
  }

  const lat = body.lat != null ? Number(body.lat) : -1.0547;
  const lng = body.lng != null ? Number(body.lng) : -80.4545;
  const area_ha = Number(body.area_ha ?? 1);
  const input = { farm_id: farmId, name, area_ha, lat, lng };

  const cfg = getConfig();
  const client = getAdminClient(cfg);
  const demoFarm = getFarmStore().some((f) => f.id === farmId);

  if (client && !demoFarm) {
    try {
      const plot = await createPlot(client, userId, input);
      return NextResponse.json(plot, { status: 201 });
    } catch (e) {
      if (!isDbMissingError(e)) {
        // Still allow memory fallback when schema is incomplete
        const detail = errorDetail(e);
        const schemaIssue =
          /column|schema cache|PGRST204|does not exist|pertenece/i.test(detail);
        if (!schemaIssue) {
          return NextResponse.json({ detail }, { status: 500 });
        }
      }
    }
  }

  const farm =
    getFarmStore().find((f) => f.id === farmId) ??
    ({ lat, lng } as { lat: number; lng: number });

  const plot = {
    id: randomUUID(),
    farm_id: farmId,
    name,
    area_ha,
    lat: Number.isFinite(lat) ? lat : farm.lat,
    lng: Number.isFinite(lng) ? lng : farm.lng,
    health_status: "sano",
  };
  getPlotStore().push(plot);
  return NextResponse.json(plot, { status: 201 });
}
