"use client";

import { useEffect, useState } from "react";
import { CloudRain, Droplets, Thermometer, Wind, SprayCan } from "lucide-react";
import { getWeatherBundle, type WeatherBundle } from "@/lib/api";
import { cn } from "@/lib/utils";

const SOIL_DATA = [
  { label: "pH", value: "6.2", status: "Óptimo para plátano" },
  { label: "Materia orgánica", value: "3.8%", status: "Bueno" },
  { label: "Nitrógeno (N)", value: "Medio", status: "Fertilizar en 2 semanas" },
  { label: "Fósforo (P)", value: "Alto", status: "Adecuado" },
  { label: "Potasio (K)", value: "Bajo", status: "Aplicar abono potásico" },
  { label: "Humedad del suelo", value: "68%", status: "Saturación moderada" },
];

export default function ClimaPage() {
  const [bundle, setBundle] = useState<WeatherBundle | null>(null);

  useEffect(() => {
    getWeatherBundle()
      .then(setBundle)
      .catch(() => null);
  }, []);

  const weather = bundle?.current;

  return (
    <div className="space-y-6 animate-fade-up">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-leaf">Ambiente</p>
        <h1 className="font-display text-3xl text-forest mt-1">Clima y suelo</h1>
        <p className="text-sm text-ink/60 mt-1">
          Pronóstico real y ventana de aplicación para tratamientos.
        </p>
      </header>

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
              <p className="text-[11px] text-ink/45 mt-1">{weather.location}</p>
            </div>
          ))}
        </section>
      )}

      <section className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-forest/10 bg-cream p-5">
          <h2 className="font-display text-xl text-forest mb-4">Pronóstico 5 días</h2>
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
            Fuente: Open-Meteo · {weather?.source ?? "demo"}
          </p>
        </div>

        <div className="rounded-2xl border border-forest/10 bg-cream p-5">
          <h2 className="font-display text-xl text-forest mb-4">Análisis de suelo</h2>
          <ul className="space-y-2">
            {SOIL_DATA.map((s) => (
              <li
                key={s.label}
                className="flex items-center justify-between rounded-xl border border-forest/8 bg-white px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-ink">{s.label}</p>
                  <p className="text-xs text-ink/50">{s.status}</p>
                </div>
                <span className="font-display text-lg text-leaf">{s.value}</span>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-ink/40 mt-3">
            Datos de referencia MAG Ecuador · sensores IoT próximamente
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
          {weather.condition}. Evita riego por aspersión si la humedad supera 85%.
        </div>
      )}
    </div>
  );
}
