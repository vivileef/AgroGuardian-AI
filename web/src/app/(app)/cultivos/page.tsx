"use client";

import { type FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { MapPinned, Plus } from "lucide-react";
import {
  createCrop,
  createFarm,
  createPlot,
  getCrops,
  getFarms,
  getPlots,
  type Crop,
  type Farm,
  type Plot,
} from "@/lib/api";
import { cn } from "@/lib/utils";

const statusStyle = {
  sano: "bg-emerald-50 text-emerald-800 border-emerald-200",
  riesgo: "bg-amber-50 text-amber-900 border-amber-200",
  infectado: "bg-red-50 text-red-800 border-red-200",
};

export default function CultivosPage() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showFarm, setShowFarm] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [showPlot, setShowPlot] = useState(false);
  const [busy, setBusy] = useState(false);

  const reload = async () => {
    const [c, f, p] = await Promise.all([getCrops(), getFarms(), getPlots()]);
    setCrops(c);
    setFarms(f);
    setPlots(p);
  };

  useEffect(() => {
    reload().catch((e) => setError(e.message));
  }, []);

  const onCreateFarm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await createFarm({
        name: String(fd.get("name")),
        lat: Number(fd.get("lat") || -1.0547),
        lng: Number(fd.get("lng") || -80.4545),
        area_ha: Number(fd.get("area_ha") || 1),
      });
      setShowFarm(false);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  };

  const onCreateCrop = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await createCrop({
        farm_id: String(fd.get("farm_id")),
        name: String(fd.get("name")),
        variety: String(fd.get("variety") || ""),
        growth_stage: String(fd.get("growth_stage") || "Desarrollo"),
        hectares: Number(fd.get("hectares") || 1),
      });
      setShowCrop(false);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  };

  const onCreatePlot = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await createPlot({
        farm_id: String(fd.get("farm_id")),
        name: String(fd.get("name")),
        area_ha: Number(fd.get("area_ha") || 1),
        lat: Number(fd.get("lat") || farms[0]?.lat || -1.0547),
        lng: Number(fd.get("lng") || farms[0]?.lng || -80.4545),
      });
      setShowPlot(false);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  };

  const farmName = (id: string) => farms.find((f) => f.id === id)?.name || id;

  return (
    <div className="space-y-6 animate-fade-up">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-leaf">Lotes</p>
          <h1 className="font-display text-3xl text-forest mt-1">Mis cultivos</h1>
          <p className="text-sm text-ink/60 mt-1">
            Fincas, lotes y cultivos con estado sanitario.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setShowFarm((v) => !v);
              setShowCrop(false);
              setShowPlot(false);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-forest/15 bg-white px-3 py-2 text-sm hover:bg-mist"
          >
            <Plus className="h-4 w-4" /> Finca
          </button>
          <button
            type="button"
            onClick={() => {
              setShowPlot((v) => !v);
              setShowFarm(false);
              setShowCrop(false);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-leaf/30 bg-leaf/10 px-3 py-2 text-sm font-medium text-leaf-dark hover:bg-leaf/20"
          >
            <Plus className="h-4 w-4" /> Agregar lote
          </button>
          <button
            type="button"
            onClick={() => {
              setShowCrop((v) => !v);
              setShowFarm(false);
              setShowPlot(false);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-leaf px-3 py-2 text-sm font-medium text-white hover:bg-leaf-dark"
          >
            <Plus className="h-4 w-4" /> Cultivo
          </button>
        </div>
      </header>

      {error && (
        <p className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {showFarm && (
        <form
          onSubmit={onCreateFarm}
          className="rounded-2xl border border-forest/10 bg-cream p-4 grid sm:grid-cols-2 gap-3 text-sm"
        >
          <Field name="name" label="Nombre" required placeholder="Finca El Guabo" />
          <Field name="area_ha" label="Área (ha)" type="number" step="0.1" defaultValue="2" />
          <Field name="lat" label="Lat" type="number" step="0.0001" defaultValue="-1.0547" />
          <Field name="lng" label="Lng" type="number" step="0.0001" defaultValue="-80.4545" />
          <div className="sm:col-span-2 flex gap-2">
            <button
              disabled={busy}
              type="submit"
              className="rounded-xl bg-forest px-4 py-2 text-cream text-sm disabled:opacity-40"
            >
              Guardar finca
            </button>
            <button
              type="button"
              onClick={() => setShowFarm(false)}
              className="rounded-xl px-4 py-2 text-sm text-ink/60"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {showPlot && (
        <form
          onSubmit={onCreatePlot}
          className="rounded-2xl border border-leaf/25 bg-leaf/5 p-4 grid sm:grid-cols-2 gap-3 text-sm"
        >
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-xs text-ink/50">Finca</span>
            <select
              name="farm_id"
              required
              className="w-full rounded-xl border border-forest/15 bg-white px-3 py-2"
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </label>
          <Field name="name" label="Nombre del lote" required placeholder="Lote Norte" />
          <Field name="area_ha" label="Área (ha)" type="number" step="0.1" defaultValue="1" />
          <Field
            name="lat"
            label="Lat"
            type="number"
            step="0.0001"
            defaultValue={String(farms[0]?.lat ?? -1.0547)}
          />
          <Field
            name="lng"
            label="Lng"
            type="number"
            step="0.0001"
            defaultValue={String(farms[0]?.lng ?? -80.4545)}
          />
          <div className="sm:col-span-2 flex flex-wrap items-center gap-2">
            <button
              disabled={busy || farms.length === 0}
              type="submit"
              className="rounded-xl bg-forest px-4 py-2 text-cream text-sm disabled:opacity-40"
            >
              Guardar lote
            </button>
            <button
              type="button"
              onClick={() => setShowPlot(false)}
              className="rounded-xl px-4 py-2 text-sm text-ink/60"
            >
              Cancelar
            </button>
            <Link
              href="/mapa"
              className="inline-flex items-center gap-1 text-xs text-leaf hover:underline ml-auto"
            >
              <MapPinned className="h-3.5 w-3.5" /> Ver en mapa
            </Link>
          </div>
          {farms.length === 0 && (
            <p className="sm:col-span-2 text-xs text-amber-800">
              Primero crea una finca para poder agregar lotes.
            </p>
          )}
        </form>
      )}

      {showCrop && (
        <form
          onSubmit={onCreateCrop}
          className="rounded-2xl border border-forest/10 bg-cream p-4 grid sm:grid-cols-2 gap-3 text-sm"
        >
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-xs text-ink/50">Finca</span>
            <select
              name="farm_id"
              required
              className="w-full rounded-xl border border-forest/15 bg-white px-3 py-2"
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </label>
          <Field name="name" label="Cultivo" required placeholder="Plátano Barraganete" />
          <Field name="variety" label="Variedad" placeholder="Barraganete" />
          <Field name="growth_stage" label="Etapa" defaultValue="Desarrollo" />
          <Field name="hectares" label="Hectáreas" type="number" step="0.1" defaultValue="1" />
          <div className="sm:col-span-2 flex gap-2">
            <button
              disabled={busy || farms.length === 0}
              type="submit"
              className="rounded-xl bg-forest px-4 py-2 text-cream text-sm disabled:opacity-40"
            >
              Guardar cultivo
            </button>
            <button
              type="button"
              onClick={() => setShowCrop(false)}
              className="rounded-xl px-4 py-2 text-sm text-ink/60"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {plots.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-xl text-forest">Lotes / parcelas</h2>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {plots.map((p) => (
              <article
                key={p.id}
                className="rounded-2xl border border-forest/10 bg-cream p-4"
              >
                <h3 className="font-display text-lg text-forest">{p.name}</h3>
                <p className="text-xs text-ink/50 mt-1">
                  {p.area_ha} ha · {farmName(p.farm_id)} · {p.health_status}
                </p>
                <Link
                  href={`/mapa?lote=${encodeURIComponent(p.id)}`}
                  className="inline-flex items-center gap-1 mt-3 text-xs text-leaf hover:underline"
                >
                  <MapPinned className="h-3.5 w-3.5" /> Ver área en mapa
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="font-display text-xl text-forest">Cultivos</h2>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {crops.length === 0 && (
            <p className="sm:col-span-2 xl:col-span-3 text-sm text-ink/55 rounded-2xl border border-dashed border-forest/20 bg-cream px-4 py-10 text-center">
              Aún no tienes cultivos. Crea una finca, agrega un lote y registra tu cultivo.
            </p>
          )}
          {crops.map((c) => (
            <article
              key={c.id}
              className="rounded-2xl border border-forest/10 bg-cream p-4 hover:border-leaf/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-display text-xl text-forest">{c.name}</h2>
                <span
                  className={cn(
                    "rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase",
                    statusStyle[c.status]
                  )}
                >
                  {c.status}
                </span>
              </div>
              <p className="text-xs text-ink/50 mt-1">
                {c.hectares} ha · {c.growth_stage} · {farmName(c.farm_id)}
              </p>
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink/50">Salud</span>
                  <span className="font-medium">{c.health_pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-sand overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      c.health_pct >= 85
                        ? "bg-leaf"
                        : c.health_pct >= 70
                          ? "bg-amber-500"
                          : "bg-red-600"
                    )}
                    style={{ width: `${c.health_pct}%` }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Field({
  name,
  label,
  ...props
}: React.ComponentProps<"input"> & { name: string; label: string }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs text-ink/50">{label}</span>
      <input
        name={name}
        className="w-full rounded-xl border border-forest/15 bg-white px-3 py-2"
        {...props}
      />
    </label>
  );
}
