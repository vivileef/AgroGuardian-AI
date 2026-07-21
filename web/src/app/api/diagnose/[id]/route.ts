import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/server/auth";
import { getConfig } from "@/lib/server/config";
import { getCaseStore, isDbMissingError } from "@/lib/server/demo-data";
import { getAdminClient, getDetection } from "@/lib/server/supabase-admin";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { userId, error } = await requireUserId();
  if (error || !userId) return error!;

  const { id } = await ctx.params;

  const memory = getCaseStore().get(id);
  if (memory) return NextResponse.json(memory);

  const cfg = getConfig();
  const client = getAdminClient(cfg);
  if (client) {
    try {
      const row = await getDetection(client, userId, id);
      if (row) return NextResponse.json(row);
    } catch (e) {
      if (!isDbMissingError(e)) {
        /* 404 below */
      }
    }
  }

  return NextResponse.json({ detail: "Caso no encontrado." }, { status: 404 });
}
