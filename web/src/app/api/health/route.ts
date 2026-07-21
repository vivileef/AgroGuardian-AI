import { NextResponse } from "next/server";
import { getConfig, hasOpenRouter, hasSupabase } from "@/lib/server/config";

export async function GET() {
  const cfg = getConfig();
  return NextResponse.json({
    status: "ok",
    demo_mode: cfg.demoMode,
    openrouter: hasOpenRouter(cfg),
    openweather: false,
    supabase: hasSupabase(cfg),
    models: { text: cfg.openrouterModel, vision: cfg.openrouterVisionModel },
  });
}
