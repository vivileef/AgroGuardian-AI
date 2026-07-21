import { NextResponse } from "next/server";
import { MARKET_PRICES } from "@/lib/server/demo-data";

export async function GET() {
  const now = new Date().toISOString().slice(0, 10);
  return NextResponse.json(MARKET_PRICES.map((p) => ({ ...p, updated: now })));
}
