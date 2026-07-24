import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/server/auth";
import { getConfig } from "@/lib/server/config";
import { getCaseStore } from "@/lib/server/demo-data";
import { buildReportPdf } from "@/lib/server/report";
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

  const pdf = await buildReportPdf(result);
  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="agroguardian-${id.slice(0, 8)}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
