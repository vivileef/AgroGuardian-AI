import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/server/auth";
import { getConfig } from "@/lib/server/config";
import { isDbMissingError } from "@/lib/server/demo-data";
import {
  createPlot,
  getAdminClient,
  listPlots,
} from "@/lib/server/supabase-admin";

export async function GET(req: NextRequest) {
  const { userId, error } = await requireUserId();
  if (error || !userId) return error!;

  const farmId = req.nextUrl.searchParams.get("farm_id");
  const cfg = getConfig();
  const client = getAdminClient(cfg);
  if (!client) return NextResponse.json([]);

  try {
    let plots = await listPlots(client, userId);
    if (farmId) plots = plots.filter((p) => p.farm_id === farmId);
    return NextResponse.json(plots);
  } catch (e) {
    if (isDbMissingError(e)) return NextResponse.json([]);
    return NextResponse.json([]);
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

  const cfg = getConfig();
  const client = getAdminClient(cfg);
  if (!client) {
    return NextResponse.json({ detail: "Supabase no configurado" }, { status: 503 });
  }

  try {
    const plot = await createPlot(client, userId, {
      farm_id: farmId,
      name,
      area_ha: Number(body.area_ha ?? 1),
      lat: body.lat != null ? Number(body.lat) : undefined,
      lng: body.lng != null ? Number(body.lng) : undefined,
    });
    return NextResponse.json(plot, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { detail: e instanceof Error ? e.message : "Error" },
      { status: 500 }
    );
  }
}
