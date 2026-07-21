import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/server/auth";
import { getConfig } from "@/lib/server/config";
import { demoDashboard, isDbMissingError } from "@/lib/server/demo-data";
import { dashboardStats, getAdminClient } from "@/lib/server/supabase-admin";

export async function GET() {
  const { userId, error } = await requireUserId();
  if (error || !userId) return error!;

  const cfg = getConfig();
  const client = getAdminClient(cfg);
  if (!client) return NextResponse.json(demoDashboard());

  try {
    return NextResponse.json(await dashboardStats(client, userId));
  } catch (e) {
    if (isDbMissingError(e)) return NextResponse.json(demoDashboard());
    return NextResponse.json(demoDashboard());
  }
}
