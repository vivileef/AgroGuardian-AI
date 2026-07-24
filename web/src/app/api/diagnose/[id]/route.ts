import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/server/auth";
import { getConfig } from "@/lib/server/config";
import { getCaseStore, isDbMissingError } from "@/lib/server/demo-data";
import { regenerateDiagnosis } from "@/lib/server/orchestrator";
import {
  deleteDetection,
  getAdminClient,
  getDetection,
  saveDetection,
} from "@/lib/server/supabase-admin";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { userId, error } = await requireUserId();
  if (error || !userId) return error!;

  const { id } = await ctx.params;

  const memory = getCaseStore().get(id);
  if (memory && !memory.demo) return NextResponse.json(memory);

  const cfg = getConfig();
  const client = getAdminClient(cfg);
  if (client) {
    try {
      const row = await getDetection(client, userId, id);
      if (row && !row.demo) return NextResponse.json(row);
    } catch (e) {
      if (!isDbMissingError(e)) {
        /* 404 below */
      }
    }
  }

  return NextResponse.json({ detail: "Caso no encontrado." }, { status: 404 });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { userId, error } = await requireUserId();
  if (error || !userId) return error!;

  const { id } = await ctx.params;
  const cfg = getConfig();
  const client = getAdminClient(cfg);
  const memory = getCaseStore();

  if (client) {
    try {
      await deleteDetection(client, userId, id);
    } catch (e) {
      if (!isDbMissingError(e)) {
        // Still remove from memory if present
        const detail = e instanceof Error ? e.message : "No se pudo eliminar";
        if (!memory.has(id) && !/no encontrado/i.test(detail)) {
          return NextResponse.json({ detail }, { status: 500 });
        }
      }
    }
  }

  memory.delete(id);
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { userId, error } = await requireUserId();
  if (error || !userId) return error!;

  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const action = String(body.action ?? "regenerate");
  if (action !== "regenerate") {
    return NextResponse.json({ detail: "Acción no soportada" }, { status: 400 });
  }

  const cfg = getConfig();
  const client = getAdminClient(cfg);
  let existing = getCaseStore().get(id) ?? null;

  if (!existing && client) {
    try {
      existing = await getDetection(client, userId, id);
    } catch {
      /* below */
    }
  }
  if (!existing) {
    return NextResponse.json({ detail: "Caso no encontrado." }, { status: 404 });
  }

  const lat = body.lat != null ? Number(body.lat) : null;
  const lon = body.lon != null ? Number(body.lon) : null;

  const updated = await regenerateDiagnosis(cfg, existing, { lat, lon });
  // Keep same id so PDF/report links stay valid
  updated.id = existing.id;
  updated.crop_id = existing.crop_id;
  updated.farm_id = existing.farm_id;

  getCaseStore().set(updated.id, updated);

  if (client) {
    try {
      await saveDetection(client, userId, updated, {
        crop_id: updated.crop_id,
        farm_id: updated.farm_id,
      });
    } catch {
      /* memory already updated */
    }
  }

  return NextResponse.json(updated);
}
