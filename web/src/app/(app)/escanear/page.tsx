"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Sparkles } from "lucide-react";
import { AgentProgress, type AgentStep } from "@/components/scan/AgentProgress";
import { CameraCapture, ImageDropzone } from "@/components/scan/CameraCapture";
import {
  diagnoseImage,
  diagnoseImageStream,
  getCrops,
  getFarms,
  pdfUrl,
  type AgentTrace,
  type Crop,
  type DiagnosisResult,
  type Farm,
} from "@/lib/api";
import { SAMPLE_IMAGES } from "@/lib/samples";
import { cn, pct, riskColor } from "@/lib/utils";

const FALLBACK_CROPS = ["Plátano", "Cacao", "Maíz", "Café", "Arroz", "Otro"];

export default function EscanearPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [crop, setCrop] = useState("Plátano");
  const [cropId, setCropId] = useState<string | undefined>();
  const [farmId, setFarmId] = useState<string | undefined>();
  const [myCrops, setMyCrops] = useState<Crop[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [steps, setSteps] = useState<AgentStep[]>([]);

  useEffect(() => {
    Promise.all([getCrops(), getFarms()])
      .then(([crops, f]) => {
        setMyCrops(crops);
        setFarms(f);
        if (crops[0]) {
          setCrop(crops[0].name);
          setCropId(crops[0].id);
          setFarmId(crops[0].farm_id);
        } else if (f[0]) {
          setFarmId(f[0].id);
        }
      })
      .catch(() => null);
  }, []);

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  const onFile = (f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
    setSteps([]);
  };

  const selectMyCrop = (c: Crop) => {
    setCrop(c.name);
    setCropId(c.id);
    setFarmId(c.farm_id);
  };

  const loadSample = async (src: string, name: string, cropName: string) => {
    const res = await fetch(src);
    const blob = await res.blob();
    const f = new File([blob], name, { type: blob.type || "image/jpeg" });
    setCrop(cropName);
    const match = myCrops.find((c) =>
      c.name.toLowerCase().includes(cropName.toLowerCase().split(" ")[0])
    );
    if (match) {
      setCropId(match.id);
      setFarmId(match.farm_id);
    } else {
      setCropId(undefined);
    }
    onFile(f);
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setSteps([]);
    try {
      let lat: number | undefined;
      let lon: number | undefined;
      if (navigator.geolocation) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 4000 })
          );
          lat = pos.coords.latitude;
          lon = pos.coords.longitude;
        } catch {
          /* optional */
        }
      }

      const meta = { crop, lat, lon, crop_id: cropId, farm_id: farmId };
      const upsert = (trace: AgentTrace) => {
        setSteps((prev) => [...prev.filter((s) => s.agent !== trace.agent), trace]);
      };

      try {
        await diagnoseImageStream(file, meta, {
          onProgress: upsert,
          onResult: (data) => {
            setResult(data);
            setSteps(data.agent_trace);
            sessionStorage.setItem(`diagnosis:${data.id}`, JSON.stringify(data));
          },
          onError: (msg) => setError(msg),
        });
      } catch {
        // Fallback: non-streaming diagnose (más estable en algunos hosts)
        const data = await diagnoseImage(file, meta);
        setResult(data);
        setSteps(data.agent_trace);
        sessionStorage.setItem(`diagnosis:${data.id}`, JSON.stringify(data));
        setError(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al analizar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-up">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-leaf">Sanidad vegetal</p>
        <h1 className="font-display text-3xl text-forest mt-1">Escanear planta</h1>
        <p className="text-sm text-ink/60 mt-1">
          Vincula el escaneo a tu cultivo registrado para guardar el historial en tu finca.
        </p>
      </header>

      <div className="rounded-2xl border border-forest/10 bg-cream p-4 sm:p-5 space-y-5">
        {myCrops.length > 0 ? (
          <div>
            <label className="text-xs font-medium text-ink/60">Tu cultivo</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {myCrops.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => selectMyCrop(c)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm border transition-colors",
                    cropId === c.id
                      ? "bg-leaf text-white border-leaf"
                      : "bg-white border-forest/15 text-ink hover:border-leaf/40"
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-ink/40 mt-2">
              Finca: {farms.find((f) => f.id === farmId)?.name ?? "—"}
            </p>
          </div>
        ) : (
          <div>
            <label className="text-xs font-medium text-ink/60">Cultivo (tipo)</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {FALLBACK_CROPS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCrop(c);
                    setCropId(undefined);
                  }}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm border transition-colors",
                    crop === c
                      ? "bg-leaf text-white border-leaf"
                      : "bg-white border-forest/15 text-ink hover:border-leaf/40"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-ink/45 mt-2">
              Registra cultivos en{" "}
              <Link href="/cultivos" className="text-leaf underline">
                Mis cultivos
              </Link>{" "}
              para vincular el historial.
            </p>
          </div>
        )}

        <div>
          <p className="text-xs font-medium text-ink/60 mb-2">Muestras demo (estilo PlantVillage)</p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_IMAGES.map((s) => (
              <button
                key={s.id}
                type="button"
                disabled={loading}
                onClick={() => void loadSample(s.src, s.filename, s.crop)}
                className="rounded-lg border border-forest/15 bg-white px-3 py-1.5 text-xs hover:border-leaf/40 disabled:opacity-40"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <CameraCapture onCapture={onFile} disabled={loading} />

        <div className="relative flex items-center gap-3 text-xs text-ink/40">
          <div className="h-px flex-1 bg-forest/10" />
          o sube desde galería
          <div className="h-px flex-1 bg-forest/10" />
        </div>

        <ImageDropzone
          previewUrl={preview}
          onFile={onFile}
          onClear={() => {
            setFile(null);
            setResult(null);
            setSteps([]);
          }}
          disabled={loading}
        />

        <button
          type="button"
          disabled={!file || loading}
          onClick={() => void analyze()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest py-3.5 text-sm font-semibold text-cream disabled:opacity-40 hover:bg-leaf-dark transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analizando con agentes IA…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Analizar muestra
            </>
          )}
        </button>

        {(loading || steps.length > 0) && !result && (
          <AgentProgress steps={steps} active={loading} />
        )}

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>

      {result && (
        <div className="rounded-2xl border border-forest/10 bg-white p-4 sm:p-6 space-y-4 shadow-sm animate-fade-up">
          {result.demo && (
            <p className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-900">
              Modo demo (sin OpenRouter).
            </p>
          )}

          <AgentProgress steps={result.agent_trace} active={false} />

          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-ink/45">Diagnóstico</p>
              <h2 className="font-display text-2xl text-forest">{result.detection.disease}</h2>
              <p className="text-sm text-ink/55">
                {result.detection.crop} · {result.detection.affected_part}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-3xl text-leaf">{pct(result.detection.confidence)}</p>
              <span
                className={cn(
                  "inline-block mt-1 rounded-md border px-2 py-0.5 text-xs font-semibold uppercase",
                  riskColor(result.detection.risk_level)
                )}
              >
                Riesgo {result.detection.risk_level}
              </span>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-ink/80">{result.diagnosis}</p>
          {result.detection.rationale && (
            <p className="text-xs text-ink/50">{result.detection.rationale}</p>
          )}

          <div className="grid sm:grid-cols-2 gap-3 rounded-xl border border-forest/10 bg-mist/60 p-3 text-sm">
            <p>
              Clima <strong>{result.weather.condition}</strong>
            </p>
            <p>
              Temp <strong>{result.weather.temperature_c}°C</strong> · Humedad{" "}
              <strong>{result.weather.humidity_pct}%</strong>
            </p>
            <p>
              Lluvia <strong>{result.weather.rain_mm} mm</strong>
            </p>
            <p>
              Riesgo climático <strong className="uppercase">{result.weather.climate_risk}</strong>
            </p>
          </div>

          {result.recommendations?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider text-ink/45">Plan de tratamiento</p>
              <ul className="space-y-2">
                {result.recommendations.slice(0, 4).map((r, i) => (
                  <li
                    key={r.id ?? `${r.title}-${i}`}
                    className="rounded-xl border border-forest/10 bg-mist/40 px-3 py-2 text-sm"
                  >
                    <p className="font-medium text-forest">{r.title}</p>
                    <p className="text-xs text-ink/55 mt-0.5">{r.detail}</p>
                    <p className="text-[10px] uppercase text-ink/40 mt-1">{r.timeframe}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.follow_up?.steps?.length > 0 && (
            <div className="rounded-xl border border-forest/10 bg-white px-3 py-2.5">
              <p className="text-xs font-medium text-ink/50 mb-1">
                Seguimiento en {result.follow_up.check_in_hours} h
              </p>
              <ul className="text-xs text-ink/60 list-disc pl-4 space-y-0.5">
                {result.follow_up.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            <Link
              href={`/diagnosticos/${result.id}`}
              className="rounded-xl bg-leaf px-4 py-2.5 text-sm font-medium text-white hover:bg-leaf-dark"
            >
              Ver análisis completo
            </Link>
            <a
              href={pdfUrl(result.id)}
              className="rounded-xl border border-forest/15 bg-white px-4 py-2.5 text-sm hover:bg-mist"
              target="_blank"
              rel="noreferrer"
            >
              Descargar PDF
            </a>
            <Link
              href="/enciclopedia"
              className="rounded-xl border border-forest/15 px-4 py-2.5 text-sm hover:bg-mist"
            >
              Enciclopedia
            </Link>
            <button
              type="button"
              onClick={() => router.push("/diagnosticos")}
              className="rounded-xl border border-forest/15 px-4 py-2.5 text-sm hover:bg-mist"
            >
              Historial
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
