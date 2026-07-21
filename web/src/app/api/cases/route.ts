import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/server/auth";
import { getConfig } from "@/lib/server/config";
import { getCaseStore, isDbMissingError } from "@/lib/server/demo-data";
import { getAdminClient, listDetections } from "@/lib/server/supabase-admin";

export async function GET() {
  const { userId, error } = await requireUserId();
  if (error || !userId) return error!;

  const cfg = getConfig();
  const client = getAdminClient(cfg);
  if (client) {
    try {
      const dbCases = await listDetections(client, userId);
      if (dbCases.length) return NextResponse.json(dbCases);
    } catch (e) {
      if (!isDbMissingError(e)) {
        /* fall through to memory */
      }
    }
  }

  const cases = [...getCaseStore().values()].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  return NextResponse.json(cases);
}
