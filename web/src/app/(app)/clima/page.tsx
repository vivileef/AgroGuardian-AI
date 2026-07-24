"use client";

import { useEffect, useMemo, useState } from "react";
import { CloudRain, Droplets, MapPin, Thermometer, Wind, SprayCan } from "lucide-react";
import { getFarms, getWeatherBundle, type WeatherBundle } from "@/lib/api";
import { cn } from "@/lib/utils";

function soilFromWeather(bundle: WeatherBundle | null) {
  if (!bundle?.current) return [];
  const w = bundle.current;
  const soilMoisture = Math.min(
    95,
    Math.max(25, Math.round(w.humidity_pct * 0.55 + w.rain_mm * 4))
  );
  const drainage =
    w.rain_mm >= 8 ? "Riesgo de encharcamiento" : w.rain_mm >= 3 ? "Humedad alta" : "Drenaje aceptable";
  const irrigation =
    soilMoisture < 40
      ? "Considera riego dirigido"
      : soilMoisture > 75
        ? "Evita riego adicional hoy"
        : "Humedad adecuada para la mayoría de cultivos";
  const diseasePressure =
    w.climate_risk === "alto" || w.climate_risk === "critico"
      ? "Alta — monitorea hojas y frutos"
      : w.climate_risk === "medio"
        ? "Media — vigilancia rutinaria"
        : "Baja";

  return [
    {
      label: "Humedad estimada del suelo",
      value: `${soilMoisture}%`,
      status: irrigation,
    },
    {
      label: "Condición hídrica",
      value: drainage,
      status: `Basado en lluvia ${w.rain_mm} mm y humedad ${w.humidity_pct}%`,
    },
    {
      label: "Presión sanitaria",
      value: diseasePressure,
      status: `Riesgo climático: ${w.climate_risk}`,
    },
    {
      label: "Ventana de labranza / aplicación",
      value: bundle.spray_window.can_spray_today ? "Favorable" : "Desfavorable",
      status: bundle.spray_window.reason,
    },
  ];
}

function readGeo(): Promise<{ lat: number; lon: number } | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 4000, maximumAge: 600_000 }
    );
  });
}

export default function ClimaPage() {
  const [bundle, setBundle] = useState<WeatherBundle | null>(null);
  const [coordsLabel, setCoordsLabel] = useState<string>("Detectando ubicación…");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let lat: number | undefined;
      let lon: number | undefined;
      const geo = await readGeo();
      if (geo) {
        lat = geo.lat;
        lon = geo.lon;
        if (!cancelled) setCoordsLabel("Tu ubicación actual");
      } else {
        try {
          const farms = await getFarms();
          if (farms[0]) {
            lat = farms[0].lat;
            lon = farms[0].lng;
            if (!cancelled) setCoordsLabel(`Finca: ${farms[0].name}`);
          } else if (!cancelled) {
            setCoordsLabel("Ubicación predeterminada (Portoviejo)");
          }
        } catch {
          if (!cancelled) setCoordsLabel("Ubicación predeterminada (Portoviejo)");
        }
      }
      try {
        const data = await getWeatherBundle(lat, lon);
        if (!cancelled) setBundle(data);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "No se pudo cargar el clima");
          setBundle(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const weather = bundle?.current;
  const soil = useMemo(() => soilFromWeather(bundle), [bundle]);

  return (
    <div className="space-y-6 animate-fade-up">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-leaf">Ambiente</p>
        <h1 className="font-display text-3xl text-forest mt-1">Clima y suelo</h1>
        <p className="text-sm text-ink/60 mt-1 flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-leaf" />
          {coordsLabel}
          {weather?.location ? ` · ${weather.location}` : ""}
        </p>
      </header>

      {error && (
        <p className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {bundle && (
        <div
          className={cn(
            "rounded-2xl border px-4 py-3 text-sm flex gap-3 items-start",
            bundle.spray_window.can_spray_today
              ? "border-leaf/30 bg-leaf/10 text-forest"
              : "border-amber-200 bg-amber-50 text-amber-950"
          )}
        >
          <SprayCan className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">
              {bundle.spray_window.can_spray_today
                ? "Hoy puedes aplicar tratamientos"
                : "Hoy no es ideal fumigar"}
            </p>
            <p className="text-xs mt-0.5 opacity-80">
              {bundle.spray_window.reason}
              {bundle.spray_window.best_day
                ? ` · Mejor día: ${bundle.spray_window.best_day}`
                : ""}
            </p>
          </div>
        </div>
      )}

      {weather && (
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Temperatura", value: `${weather.temperature_c}°C`, icon: Thermometer },
            { label: "Humedad", value: `${weather.humidity_pct}%`, icon: Droplets },
            { label: "Lluvia", value: `${weather.rain_mm} mm`, icon: CloudRain },
            { label: "Viento", value: `${weather.wind_kmh} km/h`, icon: Wind },
          ].map((m) => (
            <div key={m.label} className="rounded-2xl border border-forest/10 bg-cream p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-ink/50">{m.label}</p>
                <m.icon className="h-4 w-4 text-leaf" />
              </div>
              <p className="mt-2 font-display text-2xl text-forest">{m.value}</p>
              <p className="text-[11px] text-ink/45 mt-1">{weather.condition}</p>
            </div>
          ))}
        </section>
      )}

      <section className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-forest/10 bg-cream p-5">
          <h2 className="font-display text-xl text-forest mb-4">Pronóstico 5 días</h2>
          {!bundle && !error && (
            <p className="text-sm text-ink/50 animate-pulse">Cargando clima local…</p>
          )}
          <ul className="space-y-3">
            {(bundle?.forecast ?? []).map((f) => (
              <li
                key={f.date}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-mist/60 px-4 py-3 text-sm"
              >
                <span className="font-medium w-24">{f.day_label}</span>
                <span className="text-ink/70 text-xs flex-1">{f.condition}</span>
                <span>
                  {f.temp_max}° / {f.temp_min}°
                </span>
                <span className="text-ink/50 text-xs">Lluvia {f.rain_prob}%</span>
                <span
                  className={cn(
                    "text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md border",
                    f.spray_ok
                      ? "border-leaf/30 text-leaf bg-leaf/10"
                      : "border-amber-300 text-amber-800 bg-amber-50"
                  )}
                >
                  {f.spray_ok ? "Aplicar OK" : "Esperar"}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-ink/40 mt-3">
            Fuente: Open-Meteo · {weather?.source ?? "—"} · {weather?.location ?? ""}
          </p>
        </div>

        <div className="rounded-2xl border border-forest/10 bg-cream p-5">
          <h2 className="font-display text-xl text-forest mb-4">Condición de suelo (estimada)</h2>
          <ul className="space-y-2">
            {soil.map((s) => (
              <li
                key={s.label}
                className="flex items-center justify-between gap-3 rounded-xl border border-forest/8 bg-white px-4 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-medium text-ink">{s.label}</p>
                  <p className="text-xs text-ink/50">{s.status}</p>
                </div>
                <span className="font-display text-base text-leaf shrink-0 text-right max-w-[40%]">
                  {s.value}
                </span>
              </li>
            ))}
            {soil.length === 0 && (
              <li className="text-sm text-ink/50 py-6 text-center">
                Esperando datos climáticos de tu ubicación…
              </li>
            )}
          </ul>
          <p className="text-[10px] text-ink/40 mt-3">
            Estimación a partir del clima local (sin sensores IoT). No sustituye análisis de laboratorio.
          </p>
        </div>
      </section>

      {weather && (
        <div
          className={cn(
            "rounded-2xl border px-4 py-3 text-sm",
            weather.climate_risk === "alto" || weather.climate_risk === "critico"
              ? "border-red-200 bg-red-50 text-red-900"
              : "border-amber-200 bg-amber-50 text-amber-900"
          )}
        >
          <strong>Riesgo climático: {weather.climate_risk.toUpperCase()}</strong> —{" "}
          {weather.condition} en {weather.location}. Evita riego por aspersión si la humedad supera
          85%.
        </div>
      )}
    </div>
  );
}
