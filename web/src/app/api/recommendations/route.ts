import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/server/auth";
import { getConfig } from "@/lib/server/config";
import {
  getAdminClient,
  setRecommendationCompleted,
} from "@/lib/server/supabase-admin";

export async function PATCH(req: NextRequest) {
  const { userId, error } = await requireUserId();
  if (error || !userId) return error!;

  const body = await req.json();
  const id = String(body.id ?? "");
  const completed = Boolean(body.completed);
  if (!id) {
    return NextResponse.json({ detail: "id requerido" }, { status: 400 });
  }

  const cfg = getConfig();
  const client = getAdminClient(cfg);
  if (!client) {
    return NextResponse.json({ detail: "Supabase no configurado" }, { status: 503 });
  }

  try {
    await setRecommendationCompleted(client, userId, id, completed);
    return NextResponse.json({ ok: true, id, completed });
  } catch (e) {
    return NextResponse.json(
      { detail: e instanceof Error ? e.message : "Error" },
      { status: 500 }
    );
  }
}
