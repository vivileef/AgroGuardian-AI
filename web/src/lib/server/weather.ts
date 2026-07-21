import type { AppConfig } from "./config";
import type { RiskLevel, WeatherSnapshot } from "@/types/api";

function riskFromHumidityRain(humidity: number, rain: number): RiskLevel {
  if (humidity >= 85 || rain >= 15) return "alto";
  if (humidity >= 70 || rain >= 5) return "medio";
  return "bajo";
}

function weatherCodeLabel(code: number) {
  const map: Record<number, string> = {
    0: "Despejado",
    1: "Mayormente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Neblina",
    51: "Llovizna ligera",
    61: "Lluvia ligera",
    63: "Lluvia moderada",
    65: "Lluvia intensa",
    80: "Chubascos",
    95: "Tormenta",
  };
  return map[code] ?? "Condición variable";
}

export async function fetchWeather(
  cfg: AppConfig,
  lat?: number | null,
  lon?: number | null
): Promise<WeatherSnapshot> {
  const la = lat ?? cfg.defaultLat;
  const lo = lon ?? cfg.defaultLon;
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(la));
  url.searchParams.set("longitude", String(lo));
  url.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code"
  );
  url.searchParams.set("timezone", "America/Guayaquil");

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) throw new Error("Open-Meteo error");
  const data = await res.json();
  const c = data.current ?? {};
  const temp = Number(c.temperature_2m ?? 28);
  const humidity = Number(c.relative_humidity_2m ?? 80);
  const rain = Number(c.precipitation ?? 0);
  const wind = Number(c.wind_speed_10m ?? 5);

  return {
    temperature_c: Math.round(temp * 10) / 10,
    humidity_pct: Math.round(humidity * 10) / 10,
    rain_mm: Math.round(rain * 10) / 10,
    wind_kmh: Math.round(wind * 10) / 10,
    condition: weatherCodeLabel(Number(c.weather_code ?? 0)),
    climate_risk: riskFromHumidityRain(humidity, rain),
    source: "open-meteo",
    location: "Manabí, Ecuador",
  };
}

export function demoWeather(): WeatherSnapshot {
  return {
    temperature_c: 28.4,
    humidity_pct: 87,
    rain_mm: 6.2,
    wind_kmh: 12,
    condition: "Humedad alta / chubascos",
    climate_risk: "alto",
    source: "demo",
    location: "Portoviejo, Manabí",
  };
}
