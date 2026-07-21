import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/server/auth";
import { getConfig } from "@/lib/server/config";
import { getCaseStore } from "@/lib/server/demo-data";
import { buildReportHtml } from "@/lib/server/report";
import { getAdminClient, getDetection } from "@/lib/server/supabase-admin";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  let result = getCaseStore().get(id);

  if (!result) {
    const { userId } = await requireUserId();
    const cfg = getConfig();
    const client = userId ? getAdminClient(cfg) : null;
    if (client && userId) {
      try {
        result = (await getDetection(client, userId, id)) ?? undefined;
      } catch {
        /* 404 */
      }
    }
  }

  if (!result) {
    return NextResponse.json({ detail: "Caso no encontrado." }, { status: 404 });
  }

  const html = buildReportHtml(result);
  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="agroguardian-${id.slice(0, 8)}.html"`,
    },
  });
}
