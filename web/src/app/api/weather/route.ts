import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/server/auth";
import { getConfig } from "@/lib/server/config";
import {
  createClimateAlert,
  getAdminClient,
} from "@/lib/server/supabase-admin";
import {
  demoWeather,
  demoWeatherBundle,
  fetchWeather,
  fetchWeatherBundle,
} from "@/lib/server/weather";

export async function GET(req: NextRequest) {
  const cfg = getConfig();
  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");
  const full = req.nextUrl.searchParams.get("forecast") === "1";

  try {
    if (full) {
      const bundle = await fetchWeatherBundle(
        cfg,
        lat ? Number(lat) : null,
        lon ? Number(lon) : null
      );

      const { userId } = await requireUserId();
      const client = userId ? getAdminClient(cfg) : null;
      if (client && userId) {
        try {
          await createClimateAlert(client, userId, bundle.current);
        } catch {
          /* optional */
        }
      }

      return NextResponse.json(bundle);
    }

    const weather = await fetchWeather(
      cfg,
      lat ? Number(lat) : null,
      lon ? Number(lon) : null
    );
    return NextResponse.json(weather);
  } catch {
    if (full) return NextResponse.json(demoWeatherBundle());
    return NextResponse.json(demoWeather());
  }
}
