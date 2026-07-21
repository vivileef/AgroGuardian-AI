import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/server/auth";
import { getConfig } from "@/lib/server/config";
import { isDbMissingError } from "@/lib/server/demo-data";
import {
  getAdminClient,
  listNotifications,
  markNotificationRead,
} from "@/lib/server/supabase-admin";

export async function GET() {
  const { userId, error } = await requireUserId();
  if (error || !userId) return error!;

  const cfg = getConfig();
  const client = getAdminClient(cfg);
  if (!client) {
    return NextResponse.json([]);
  }

  try {
    const rows = await listNotifications(client, userId);
    return NextResponse.json(rows);
  } catch (e) {
    if (isDbMissingError(e)) return NextResponse.json([]);
    return NextResponse.json([]);
  }
}

export async function PATCH(req: NextRequest) {
  const { userId, error } = await requireUserId();
  if (error || !userId) return error!;

  const body = await req.json();
  const id = String(body.id ?? "");
  if (!id) return NextResponse.json({ detail: "id requerido" }, { status: 400 });

  const cfg = getConfig();
  const client = getAdminClient(cfg);
  if (!client) return NextResponse.json({ ok: true });

  try {
    await markNotificationRead(client, userId, id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { detail: e instanceof Error ? e.message : "Error" },
      { status: 500 }
    );
  }
}
