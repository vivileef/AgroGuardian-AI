import { NextResponse } from "next/server";
import { getCaseStore } from "@/lib/server/demo-data";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const result = getCaseStore().get(id);
  if (!result) {
    return NextResponse.json({ detail: "Caso no encontrado." }, { status: 404 });
  }
  return NextResponse.json(result);
}
