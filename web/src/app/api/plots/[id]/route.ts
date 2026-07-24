import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/server/auth";
import { getConfig } from "@/lib/server/config";
import { getPlotStore, isDbMissingError } from "@/lib/server/demo-data";
import { deletePlot, getAdminClient, updatePlot } from "@/lib/server/supabase-admin";

function errorDetail(e: unknown) {
  if (e instanceof Error) return e.message;
  if (typeof e === "object" && e && "message" in e) {
    return String((e as { message: unknown }).message);
  }
  return "No se pudo procesar el lote";
}

function schemaIssue(detail: string) {
  return /column|schema cache|PGRST204|does not exist|pertenece|no encontrado/i.test(detail);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId, error } = await requireUserId();
  if (error || !userId) return error!;

  const { id } = await params;
  const body = await req.json();
  const patch: { name?: string; area_ha?: number; lat?: number; lng?: number } = {};
  if (body.name != null) patch.name = String(body.name).trim();
  if (body.area_ha != null) patch.area_ha = Number(body.area_ha);
  if (body.lat != null) patch.lat = Number(body.lat);
  if (body.lng != null) patch.lng = Number(body.lng);

  const cfg = getConfig();
  const client = getAdminClient(cfg);
  const memory = getPlotStore();
  const inMemory = memory.find((p) => p.id === id);

  if (client && !inMemory) {
    try {
      const plot = await updatePlot(client, userId, id, patch);
      return NextResponse.json(plot);
    } catch (e) {
      const detail = errorDetail(e);
      if (!isDbMissingError(e) && !schemaIssue(detail)) {
        return NextResponse.json({ detail }, { status: 500 });
      }
    }
  }

  // In-memory fallback
  const plot = memory.find((p) => p.id === id);
  if (!plot) {
    return NextResponse.json({ detail: "Lote no encontrado" }, { status: 404 });
  }
  if (patch.name != null) plot.name = patch.name;
  if (patch.area_ha != null && Number.isFinite(patch.area_ha)) plot.area_ha = patch.area_ha;
  if (patch.lat != null && Number.isFinite(patch.lat)) plot.lat = patch.lat;
  if (patch.lng != null && Number.isFinite(patch.lng)) plot.lng = patch.lng;
  return NextResponse.json(plot);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId, error } = await requireUserId();
  if (error || !userId) return error!;

  const { id } = await params;
  const cfg = getConfig();
  const client = getAdminClient(cfg);
  const memory = getPlotStore();
  const inMemory = memory.some((p) => p.id === id);

  if (client && !inMemory) {
    try {
      await deletePlot(client, userId, id);
      return NextResponse.json({ ok: true });
    } catch (e) {
      const detail = errorDetail(e);
      if (!isDbMissingError(e) && !schemaIssue(detail)) {
        return NextResponse.json({ detail }, { status: 500 });
      }
    }
  }

  const idx = memory.findIndex((p) => p.id === id);
  if (idx >= 0) {
    memory.splice(idx, 1);
  }
  return NextResponse.json({ ok: true });
}
