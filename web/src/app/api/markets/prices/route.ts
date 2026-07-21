import { NextResponse } from "next/server";
import { getConfig } from "@/lib/server/config";
import { MARKET_PRICES } from "@/lib/server/demo-data";
import { getAdminClient, listMarketPrices } from "@/lib/server/supabase-admin";

export async function GET() {
  const now = new Date().toISOString().slice(0, 10);
  const cfg = getConfig();
  const client = getAdminClient(cfg);
  if (client) {
    try {
      const rows = await listMarketPrices(client);
      if (rows?.length) return NextResponse.json(rows);
    } catch {
      /* fallback */
    }
  }
  return NextResponse.json(MARKET_PRICES.map((p) => ({ ...p, updated: now })));
}
