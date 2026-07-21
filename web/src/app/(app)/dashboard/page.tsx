"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Droplets,
  Leaf,
  Mic,
  Play,
  Satellite,
  Send,
  Thermometer,
  Layers,
  CloudRain,
  Wind,
} from "lucide-react";
import {
  getCases,
  getCrops,
  getMarketPrices,
  getWeatherBundle,
  type Crop,
  type DiagnosisResult,
  type MarketPrice,
  type WeatherBundle,
} from "@/lib/api";
import { cn, pct, riskColor } from "@/lib/utils";

export default function DashboardPage() {
  const [bundle, setBundle] = useState<WeatherBundle | null>(null);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [cases, setCases] = useState<DiagnosisResult[]>([]);
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [ask, setAsk] = useState("");

  useEffect(() => {
    getWeatherBundle()
      .then(setBundle)
      .catch(() => null);
    getCrops().then(setCrops).catch(() => setCrops([]));
    getCases().then(setCases).catch(() => setCases([]));
    getMarketPrices().then(setPrices).catch(() => setPrices([]));
  }, []);

  const weather = bundle?.current;
  const avgHealth = crops.length
    ? Math.round(crops.reduce((a, c) => a + c.health_pct, 0) / crops.length)
    : 87;
  const detected = cases.length || crops.filter((c) => c.status !== "sano").length;
  const latest = cases[0] ?? null;

  const mapPins = useMemo(() => {
    const fromCrops = crops.slice(0, 3).map((c, i) => ({
      id: c.id,
      label: c.name.split(" ")[0],
      health: c.health_pct,
      status: c.status,
      x: 22 + i * 28,
      y: 35 + (i % 2) * 18,
    }));
    if (fromCrops.length) return fromCrops;
    return [
      { id: "1", label: "Cacao", health: 92, status: "sano" as const, x: 28, y: 38 },
      { id: "2", label: "Plátano", health: 74, status: "riesgo" as const, x: 52, y: 48 },
      { id: "3", label: "Maíz", health: 58, status: "infectado" as const, x: 72, y: 36 },
    ];
  }, [crops]);

  const soilPoints = "0,40 20,28 40,45 60,22 80,35 100,18 120,30 140,15 160,28 180,12 200,22";

  return (
    <div className="animate-fade-up space-y-4">
      {/* KPI row */}
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          {
            label: "Cultivos Activos",
            value: String(crops.length || 12),
            hint: "+2 esta semana",
            hintOk: true,
            icon: Leaf,
          },
          {
            label: "Casos Detectados",
            value: String(detected || 3),
            hint: "-1 esta semana",
            hintOk: true,
            icon: AlertTriangle,
          },
          {
            label: "Riesgo Climático",
            value: weather ? weather.climate_risk.toUpperCase() : "ALTO",
            hint: weather ? `Humedad ${weather.humidity_pct}%` : "Humedad 78%",
            hintOk: false,
            icon: Droplets,
          },
          {
            label: "Salud Promedio",
            value: `${avgHealth}%`,
            hint: "+5% vs anterior",
            hintOk: true,
            icon: Thermometer,
          },
        ].map((m) => (
          <div key={m.label} className="glass rounded-2xl px-4 py-3.5 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-neon/5 blur-xl" />
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-muted uppercase tracking-wide">{m.label}</p>
              <m.icon className="h-4 w-4 text-neon" />
            </div>
            <p className="mt-2 font-display text-3xl text-white tracking-tight">{m.value}</p>
            <p className={cn("text-[11px] mt-1", m.hintOk ? "text-neon/80" : "text-warn")}>
              {m.hint}
            </p>
          </div>
        ))}
      </section>

      {/* Main 3-column grid */}
      <section className="grid xl:grid-cols-12 gap-4">
        {/* Center column */}
        <div className="xl:col-span-8 space-y-4">
          {/* Hero map */}
          <div className="glass rounded-3xl overflow-hidden relative min-h-[320px] sm:min-h-[380px]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(ellipse 80% 60% at 50% 40%, rgba(40,120,80,0.35), transparent 70%),
                  linear-gradient(180deg, #1a3a2a 0%, #0d1f18 40%, #071210 100%),
                  url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")
                `,
              }}
            />
            {/* Terrain bands */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0a1a12] via-[#143528]/80 to-transparent" />
            <div className="absolute left-[10%] top-[45%] h-[30%] w-[35%] rounded-[40%] bg-emerald-700/40 blur-sm rotate-[-8deg]" />
            <div className="absolute right-[15%] top-[40%] h-[35%] w-[40%] rounded-[45%] bg-lime-800/30 blur-sm rotate-[6deg]" />
            <div className="absolute left-[35%] top-[55%] h-8 w-[40%] rounded-full bg-sky-500/20 blur-md" />

            {/* Scan grids */}
            <div className="absolute left-[20%] top-[42%] h-24 w-28 border border-cyan-400/40 rounded-lg bg-cyan-400/5 shadow-[0_0_30px_rgba(34,211,238,0.25)]">
              <div className="absolute inset-0 opacity-40" style={{
                backgroundImage:
                  "linear-gradient(rgba(34,211,238,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.35) 1px, transparent 1px)",
                backgroundSize: "12px 12px",
              }} />
            </div>
            <div className="absolute right-[22%] top-[38%] h-20 w-24 border border-cyan-400/30 rounded-lg bg-cyan-400/5">
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage:
                  "linear-gradient(rgba(34,211,238,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.35) 1px, transparent 1px)",
                backgroundSize: "10px 10px",
              }} />
            </div>

            {/* Drone dots */}
            <div className="absolute left-[28%] top-[36%] h-2 w-2 rounded-full bg-white shadow-[0_0_12px_#fff] animate-pulse-soft" />
            <div className="absolute right-[30%] top-[32%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9]" />

            {/* Layer controls */}
            <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
              {[Satellite, Layers, Droplets, Thermometer, CloudRain].map((Icon, i) => (
                <button
                  key={i}
                  type="button"
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-xl glass text-white/70 hover:text-neon",
                    i === 0 && "text-neon ring-1 ring-neon/40"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>

            <div className="absolute right-3 top-3 z-10">
              <Link
                href="/mapa"
                className="rounded-xl bg-neon/15 px-3 py-1.5 text-[11px] font-semibold text-neon ring-1 ring-neon/30 hover:bg-neon/25"
              >
                Ver mapa completo
              </Link>
            </div>

            {/* Pins */}
            {mapPins.map((p) => (
              <div
                key={p.id}
                className="absolute z-10 -translate-x-1/2 -translate-y-full"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                <div
                  className={cn(
                    "rounded-xl px-2.5 py-1.5 text-[11px] font-semibold backdrop-blur-md ring-1 shadow-lg whitespace-nowrap",
                    p.status === "sano" && "bg-emerald-500/20 text-mint ring-emerald-400/40",
                    p.status === "riesgo" && "bg-amber-500/20 text-warn ring-amber-400/40",
                    p.status === "infectado" && "bg-red-500/20 text-danger ring-red-400/40"
                  )}
                >
                  {p.label}{" "}
                  <span className="opacity-80">
                    ({p.status === "sano" ? `Salud ${p.health}%` : p.status === "riesgo" ? "Riesgo Medio" : "Riesgo Alto"})
                  </span>
                </div>
                <div className="mx-auto mt-1 h-2 w-2 rounded-full bg-white shadow-[0_0_10px_#fff]" />
              </div>
            ))}

            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 text-[10px] text-white/60 z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-1">
                <i className="h-2 w-2 rounded-full bg-mint" /> Sano
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-1">
                <i className="h-2 w-2 rounded-full bg-warn" /> Riesgo
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-1">
                <i className="h-2 w-2 rounded-full bg-danger" /> Infectado
              </span>
            </div>
          </div>

          {/* IA Assistant orb */}
          <div className="glass rounded-3xl px-4 py-5 sm:px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(182,255,0,0.12),transparent_55%)]" />
            <div className="relative flex flex-col items-center text-center gap-3">
              <div className="relative h-20 w-20 rounded-full grid place-items-center animate-glow bg-neon/10 ring-2 ring-neon/50">
                <div className="absolute inset-0 rounded-full border border-neon/20 animate-radar" />
                <Leaf className="h-8 w-8 text-neon" />
              </div>
              <p className="text-sm sm:text-base text-white/90 max-w-md">
                ¿En qué puedo ayudarte hoy? Pregunta por voz o texto…
              </p>
              <form
                className="flex w-full max-w-xl items-center gap-2 rounded-2xl bg-white/5 ring-1 ring-white/10 px-3 py-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!ask.trim()) return;
                  window.location.href = `/asistente?q=${encodeURIComponent(ask)}`;
                }}
              >
                <input
                  value={ask}
                  onChange={(e) => setAsk(e.target.value)}
                  placeholder="Ej: ¿Cómo trato la sigatoka en plátano?"
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-muted outline-none"
                />
                <button type="button" className="grid h-9 w-9 place-items-center rounded-xl text-muted hover:text-neon" aria-label="Voz">
                  <Mic className="h-4 w-4" />
                </button>
                <button
                  type="submit"
                  className="grid h-9 w-9 place-items-center rounded-xl bg-neon text-void hover:bg-neon-dim"
                  aria-label="Enviar"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Bottom widgets */}
          <div className="grid md:grid-cols-3 gap-3">
            <div className="glass rounded-2xl p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">
                Clima en tu zona
              </h3>
              <ul className="space-y-2">
                {(bundle?.forecast ?? []).slice(0, 4).map((f) => (
                  <li key={f.date} className="flex items-center justify-between text-sm">
                    <span className="text-white/80 w-16">{f.day_label}</span>
                    <span className="text-muted text-xs flex-1 truncate px-2">{f.condition}</span>
                    <span className="text-white font-medium">{f.temp_max}°</span>
                    <span className="text-muted text-xs w-12 text-right">{f.humidity_avg}%</span>
                  </li>
                ))}
                {!bundle && (
                  <li className="text-xs text-muted py-6 text-center">Cargando pronóstico…</li>
                )}
              </ul>
            </div>

            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Humedad del Suelo
                </h3>
                <Wind className="h-3.5 w-3.5 text-neon" />
              </div>
              <svg viewBox="0 0 200 50" className="w-full h-16 mt-2">
                <defs>
                  <linearGradient id="soilFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#b6ff00" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#b6ff00" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline
                  fill="url(#soilFill)"
                  stroke="none"
                  points={`0,50 ${soilPoints} 200,50`}
                />
                <polyline
                  fill="none"
                  stroke="#b6ff00"
                  strokeWidth="2"
                  points={soilPoints}
                  style={{ filter: "drop-shadow(0 0 6px #b6ff00)" }}
                />
              </svg>
              <p className="text-[10px] text-muted mt-1">Últimas 24 h · referencia de campo</p>
            </div>

            <div className="glass rounded-2xl p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">
                Mercados & Precios
              </h3>
              <ul className="space-y-2.5">
                {(prices.length ? prices : [
                  { crop: "Cacao", price_usd: 3.15, unit: "kg", trend: "up" as const, market: "Manta", updated: "" },
                  { crop: "Plátano", price_usd: 0.42, unit: "kg", trend: "up" as const, market: "Portoviejo", updated: "" },
                  { crop: "Maíz", price_usd: 0.38, unit: "kg", trend: "down" as const, market: "Chone", updated: "" },
                ]).slice(0, 3).map((p) => (
                  <li key={p.crop} className="flex items-center justify-between text-sm">
                    <span className="text-white/85">{p.crop}</span>
                    <span className="text-white font-semibold">${p.price_usd.toFixed(2)}</span>
                    <span
                      className={cn(
                        "text-[10px] font-semibold",
                        p.trend === "up" ? "text-neon" : p.trend === "down" ? "text-danger" : "text-muted"
                      )}
                    >
                      {p.trend === "up" ? "+2.1%" : p.trend === "down" ? "-1.4%" : "0%"}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/mercados" className="mt-3 inline-block text-[11px] text-neon hover:underline">
                Ver todos →
              </Link>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="xl:col-span-4 space-y-4">
          <div className="glass-strong rounded-3xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Diagnóstico Inteligente</h3>
              <span className="text-[10px] text-neon">En vivo</span>
            </div>

            <div className="relative overflow-hidden rounded-2xl aspect-[16/10] bg-gradient-to-br from-emerald-900 to-navy ring-1 ring-white/10">
              <div
                className="absolute inset-0 opacity-80"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 40%, #3d6b2f 0%, transparent 40%), radial-gradient(circle at 70% 60%, #1a3a20 0%, #0a1520 70%)",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Leaf className="h-16 w-16 text-lime-600/50 rotate-12" />
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold text-white drop-shadow">
                    {latest?.detection.disease ?? "Sigatoka Negra"}
                  </p>
                  <p className="text-[10px] text-white/70">
                    {latest
                      ? `${latest.detection.crop}`
                      : "Detectado en Plátano · Lote 2 · Sector Norte"}
                  </p>
                </div>
                <div className="relative h-12 w-12">
                  <svg viewBox="0 0 36 36" className="-rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      stroke="#b6ff00"
                      strokeWidth="3"
                      strokeDasharray={`${(latest ? latest.detection.confidence : 0.94) * 94} 94`}
                      style={{ filter: "drop-shadow(0 0 4px #b6ff00)" }}
                    />
                  </svg>
                  <span className="absolute inset-0 grid place-items-center text-[9px] font-bold text-neon">
                    {latest ? pct(latest.detection.confidence) : "94%"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase",
                  riskColor(latest?.detection.risk_level ?? "alto")
                )}
              >
                Riesgo {latest?.detection.risk_level ?? "Alto"}
              </span>
              <span className="text-[10px] text-muted">Confianza alta</span>
            </div>

            <div className="flex gap-1 rounded-xl bg-white/5 p-1 text-[11px]">
              {["Resumen", "Recomendaciones", "Historial"].map((t, i) => (
                <span
                  key={t}
                  className={cn(
                    "flex-1 text-center rounded-lg py-1.5",
                    i === 0 ? "bg-neon/20 text-neon" : "text-muted"
                  )}
                >
                  {t}
                </span>
              ))}
            </div>

            <p className="text-xs text-white/70 leading-relaxed line-clamp-3">
              {latest?.diagnosis ??
                "Alta probabilidad de Sigatoka Negra en plátano. Humedad elevada favorece la propagación en 48–72 h."}
            </p>

            <Link
              href={latest ? `/diagnosticos/${latest.id}` : "/escanear"}
              className="flex w-full items-center justify-center rounded-xl bg-neon py-3 text-sm font-bold text-void shadow-[0_0_24px_rgba(182,255,0,0.35)] hover:bg-neon-dim transition-colors"
            >
              Aplicar Recomendación IA
            </Link>
          </div>

          <div className="glass rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
              Próximas Acciones
            </h3>
            <ul className="space-y-2">
              {(latest?.recommendations.slice(0, 3) ?? [
                { title: "Monitoreo de lote afectado", timeframe: "hoy" },
                { title: "Revisar riego por aspersión", timeframe: "24h" },
                { title: "Aplicación recomendada", timeframe: "48h" },
              ]).map((a, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs"
                >
                  <span className="mt-0.5 h-4 w-4 rounded border border-neon/40 grid place-items-center text-neon text-[9px]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-white/90 font-medium">{a.title}</p>
                    <p className="text-muted">{a.timeframe}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/capacitacion"
            className="block rounded-2xl overflow-hidden relative p-4 bg-gradient-to-br from-violet-700/80 to-indigo-900/80 ring-1 ring-violet-400/30"
          >
            <div className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/15">
              <Play className="h-4 w-4 text-white" />
            </div>
            <p className="text-[10px] uppercase tracking-wide text-violet-200">Capacitación</p>
            <p className="text-sm font-semibold text-white mt-1 max-w-[85%]">
              Manejo de enfermedades en plátano
            </p>
            <p className="text-[11px] text-violet-200/80 mt-1">5 min · Personalizado</p>
          </Link>
        </aside>
      </section>
    </div>
  );
}
