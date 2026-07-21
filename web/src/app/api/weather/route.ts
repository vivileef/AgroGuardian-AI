import { NextRequest, NextResponse } from "next/server";
import { getConfig } from "@/lib/server/config";
import { demoWeather, fetchWeather } from "@/lib/server/weather";

export async function GET(req: NextRequest) {
  const cfg = getConfig();
  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");
  try {
    const weather = await fetchWeather(
      cfg,
      lat ? Number(lat) : null,
      lon ? Number(lon) : null
    );
    return NextResponse.json(weather);
  } catch {
    return NextResponse.json(demoWeather());
  }
}
