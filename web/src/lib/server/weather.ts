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

async function resolveLocationLabel(lat: number, lon: number): Promise<string> {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    url.searchParams.set("format", "json");
    url.searchParams.set("zoom", "10");
    url.searchParams.set("accept-language", "es");
    const res = await fetch(url.toString(), {
      headers: { "User-Agent": "AgroGuardianAI/1.0 (farm climate)" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error("geocode");
    const data = await res.json();
    const a = data?.address ?? {};
    const city = a.city || a.town || a.village || a.county || a.municipality || "";
    const region = a.state || a.region || "";
    const country = a.country || "Ecuador";
    const parts = [city, region, country].filter(Boolean);
    if (parts.length) return parts.join(", ");
  } catch {
    /* fall through */
  }
  return `Tu ubicacion (${lat.toFixed(3)}, ${lon.toFixed(3)})`;
}

export async function fetchWeather(
  cfg: AppConfig,
  lat?: number | null,
  lon?: number | null
): Promise<WeatherSnapshot> {
  const la = lat ?? cfg.defaultLat;
  const lo = lon ?? cfg.defaultLon;
  const usedDefault = lat == null || lon == null;
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
  const location = usedDefault
    ? "Portoviejo, Manabí (predeterminado)"
    : await resolveLocationLabel(la, lo);

  return {
    temperature_c: Math.round(temp * 10) / 10,
    humidity_pct: Math.round(humidity * 10) / 10,
    rain_mm: Math.round(rain * 10) / 10,
    wind_kmh: Math.round(wind * 10) / 10,
    condition: weatherCodeLabel(Number(c.weather_code ?? 0)),
    climate_risk: riskFromHumidityRain(humidity, rain),
    source: "open-meteo",
    location,
  };
}

export type ForecastDay = {
  date: string;
  day_label: string;
  temp_max: number;
  temp_min: number;
  rain_mm: number;
  rain_prob: number;
  humidity_avg: number;
  condition: string;
  climate_risk: RiskLevel;
  spray_ok: boolean;
  spray_note: string;
};

export type WeatherBundle = {
  current: WeatherSnapshot;
  forecast: ForecastDay[];
  spray_window: {
    can_spray_today: boolean;
    reason: string;
    best_day: string | null;
  };
};

function sprayAdvice(rainProb: number, humidity: number, rainMm: number) {
  if (rainMm >= 5 || rainProb >= 60) {
    return { ok: false, note: "Lluvia probable: pospone la aplicación" };
  }
  if (humidity >= 90) {
    return { ok: false, note: "Humedad muy alta: bajo residual del producto" };
  }
  if (humidity >= 80) {
    return { ok: true, note: "Ventana aceptable; aplica temprano (6–9 h)" };
  }
  return { ok: true, note: "Buena ventana de aplicación" };
}

export async function fetchWeatherBundle(
  cfg: AppConfig,
  lat?: number | null,
  lon?: number | null
): Promise<WeatherBundle> {
  const la = lat ?? cfg.defaultLat;
  const lo = lon ?? cfg.defaultLon;
  const usedDefault = lat == null || lon == null;
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(la));
  url.searchParams.set("longitude", String(lo));
  url.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code"
  );
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,relative_humidity_2m_mean"
  );
  url.searchParams.set("timezone", "America/Guayaquil");
  url.searchParams.set("forecast_days", "5");

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) throw new Error("Open-Meteo error");
  const data = await res.json();

  const c = data.current ?? {};
  const temp = Number(c.temperature_2m ?? 28);
  const humidity = Number(c.relative_humidity_2m ?? 80);
  const rain = Number(c.precipitation ?? 0);
  const wind = Number(c.wind_speed_10m ?? 5);
  const location = usedDefault
    ? "Portoviejo, Manabí (predeterminado)"
    : await resolveLocationLabel(la, lo);
  const current: WeatherSnapshot = {
    temperature_c: Math.round(temp * 10) / 10,
    humidity_pct: Math.round(humidity * 10) / 10,
    rain_mm: Math.round(rain * 10) / 10,
    wind_kmh: Math.round(wind * 10) / 10,
    condition: weatherCodeLabel(Number(c.weather_code ?? 0)),
    climate_risk: riskFromHumidityRain(humidity, rain),
    source: "open-meteo",
    location,
  };

  const daily = data.daily ?? {};
  const dates: string[] = daily.time ?? [];
  const forecast: ForecastDay[] = dates.map((date, i) => {
    const rainMm = Number(daily.precipitation_sum?.[i] ?? 0);
    const rainProb = Number(daily.precipitation_probability_max?.[i] ?? 0);
    const hum = Number(daily.relative_humidity_2m_mean?.[i] ?? humidity);
    const advice = sprayAdvice(rainProb, hum, rainMm);
    const d = new Date(date + "T12:00:00");
    const dayLabel =
      i === 0
        ? "Hoy"
        : i === 1
          ? "Mañana"
          : d.toLocaleDateString("es-EC", { weekday: "long" });
    return {
      date,
      day_label: dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1),
      temp_max: Math.round(Number(daily.temperature_2m_max?.[i] ?? temp)),
      temp_min: Math.round(Number(daily.temperature_2m_min?.[i] ?? temp)),
      rain_mm: Math.round(rainMm * 10) / 10,
      rain_prob: Math.round(rainProb),
      humidity_avg: Math.round(hum),
      condition: weatherCodeLabel(Number(daily.weather_code?.[i] ?? 0)),
      climate_risk: riskFromHumidityRain(hum, rainMm),
      spray_ok: advice.ok,
      spray_note: advice.note,
    };
  });

  const todayAdvice = sprayAdvice(
    forecast[0]?.rain_prob ?? 0,
    current.humidity_pct,
    current.rain_mm
  );
  const best = forecast.find((f) => f.spray_ok);

  return {
    current,
    forecast,
    spray_window: {
      can_spray_today: todayAdvice.ok,
      reason: todayAdvice.note,
      best_day: best?.day_label ?? null,
    },
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

export function demoWeatherBundle(): WeatherBundle {
  const current = demoWeather();
  const forecast: ForecastDay[] = [
    {
      date: new Date().toISOString().slice(0, 10),
      day_label: "Hoy",
      temp_max: 29,
      temp_min: 23,
      rain_mm: 6,
      rain_prob: 70,
      humidity_avg: 87,
      condition: "Chubascos",
      climate_risk: "alto",
      spray_ok: false,
      spray_note: "Lluvia probable: pospone la aplicación",
    },
    {
      date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      day_label: "Mañana",
      temp_max: 28,
      temp_min: 22,
      rain_mm: 1,
      rain_prob: 30,
      humidity_avg: 75,
      condition: "Parcialmente nublado",
      climate_risk: "medio",
      spray_ok: true,
      spray_note: "Buena ventana de aplicación",
    },
  ];
  for (let i = 2; i < 5; i++) {
    forecast.push({
      date: new Date(Date.now() + i * 86400000).toISOString().slice(0, 10),
      day_label: new Date(Date.now() + i * 86400000).toLocaleDateString("es-EC", {
        weekday: "long",
      }),
      temp_max: 27 + (i % 2),
      temp_min: 22,
      rain_mm: i === 3 ? 8 : 0.5,
      rain_prob: i === 3 ? 65 : 25,
      humidity_avg: 78,
      condition: i === 3 ? "Lluvia" : "Despejado",
      climate_risk: i === 3 ? "alto" : "bajo",
      spray_ok: i !== 3,
      spray_note: i === 3 ? "Lluvia probable" : "Buena ventana",
    });
  }
  return {
    current,
    forecast,
    spray_window: {
      can_spray_today: false,
      reason: "Lluvia probable: pospone la aplicación",
      best_day: "Mañana",
    },
  };
}
