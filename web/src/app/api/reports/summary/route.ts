import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/server/auth";
import { getConfig } from "@/lib/server/config";
import { getCaseStore, isDbMissingError } from "@/lib/server/demo-data";
import { getAdminClient, periodReportSummary } from "@/lib/server/supabase-admin";

export async function GET(req: NextRequest) {
  const { userId, error } = await requireUserId();
  if (error || !userId) return error!;

  const days = Number(req.nextUrl.searchParams.get("days") ?? 30);
  const cfg = getConfig();
  const client = getAdminClient(cfg);

  if (client) {
    try {
      const summary = await periodReportSummary(client, userId, days);
      return NextResponse.json(summary);
    } catch (e) {
      if (!isDbMissingError(e)) {
        /* memory fallback */
      }
    }
  }

  const cases = [...getCaseStore().values()].filter((c) => {
    if (c.demo) return false;
    const t = new Date(c.created_at).getTime();
    return t >= Date.now() - days * 86400000;
  });
  const byDisease: Record<string, number> = {};
  for (const c of cases) {
    byDisease[c.detection.disease] = (byDisease[c.detection.disease] ?? 0) + 1;
  }

  return NextResponse.json({
    period_days: days,
    scans: cases.length,
    treatments_done: 0,
    treatments_pending: cases.reduce((a, c) => a + c.recommendations.length, 0),
    by_disease: byDisease,
    recent: cases.slice(0, 10).map((c) => ({
      id: c.id,
      disease: c.detection.disease,
      risk_level: c.detection.risk_level,
      created_at: c.created_at,
    })),
  });
}
