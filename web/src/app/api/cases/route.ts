import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/server/auth";
import { getCaseStore } from "@/lib/server/demo-data";

export async function GET() {
  const { error } = await requireUserId();
  if (error) return error;

  const cases = [...getCaseStore().values()].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  return NextResponse.json(cases);
}
