import { NextResponse } from "next/server";
import { getCaseStore } from "@/lib/server/demo-data";
import { buildReportHtml } from "@/lib/server/report";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const result = getCaseStore().get(id);
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
