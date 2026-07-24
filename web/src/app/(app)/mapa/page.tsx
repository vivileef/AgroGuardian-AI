"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FarmMap } from "@/components/map/FarmMap";
import {
  createPlot,
  getFarms,
  getPlots,
  type Farm,
  type Plot,
} from "@/lib/api";
import {
  nearlySamePoint,
  offsetPlotCenter,
  plotColor,
} from "@/lib/plot-layout";
import { cn } from "@/lib/utils";

export default function MapaPage() {
  return (
    <Suspense fallback={<p className="text-sm text-ink/50">Cargando mapa…</p>}>
      <MapaInner />
    </Suspense>
  );
}

function MapaInner() {
  const search = useSearchParams();
  const preselect = search.get("lote") || search.get("plot");
  const [farms, setFarms] = useState<Farm[]>([]);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showPlot, setShowPlot] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(preselect);

  const reload = async () => {
    const [f, p] = await Promise.all([getFarms(), getPlots()]);
    setFarms(f);
    setPlots(p);
  };

  useEffect(() => {
    reload().catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (preselect) setSelectedId(preselect);
  }, [preselect]);

  const pins = useMemo(() => {
    const farmById = new Map(farms.map((f) => [f.id, f]));

    // Group plots by farm to spread ones that share the same point
    const byFarm = new Map<string, Plot[]>();
    for (const p of plots) {
      const list = byFarm.get(p.farm_id) ?? [];
      list.push(p);
      byFarm.set(p.farm_id, list);
    }

    const plotPins = plots.map((p) => {
      const farm = farmById.get(p.farm_id);
      const farmLat = Number(farm?.lat ?? -1.0547);
      const farmLng = Number(farm?.lng ?? -80.4545);
      const siblings = byFarm.get(p.farm_id) ?? [];
      const index = siblings.findIndex((s) => s.id === p.id);
      const ha = Number(p.area_ha) > 0 ? Number(p.area_ha) : 1;

      const rawLat =
        p.lat != null && Number.isFinite(Number(p.lat)) ? Number(p.lat) : farmLat;
      const rawLng =
        p.lng != null && Number.isFinite(Number(p.lng)) ? Number(p.lng) : farmLng;

      // If this lot sits on the farm center (or stacked with siblings), fan them out
      const stacked =
        nearlySamePoint({ lat: rawLat, lng: rawLng }, { lat: farmLat, lng: farmLng }) ||
        siblings.some((s, i) => {
          if (i >= index) return false;
          const sLat =
            s.lat != null && Number.isFinite(Number(s.lat)) ? Number(s.lat) : farmLat;
          const sLng =
            s.lng != null && Number.isFinite(Number(s.lng)) ? Number(s.lng) : farmLng;
          return nearlySamePoint({ lat: rawLat, lng: rawLng }, { lat: sLat, lng: sLng });
        });

      const placed = stacked
        ? offsetPlotCenter(farmLat, farmLng, Math.max(index, 0), ha)
        : { lat: rawLat, lng: rawLng };

      return {
        id: p.id,
        name: p.name,
        label: `Lote: ${p.name}`,
        lat: placed.lat,
        lng: placed.lng,
        status: (p.health_status as "sano" | "riesgo" | "infectado") || "sano",
        area_ha: ha,
        kind: "plot" as const,
        color: plotColor(Math.max(index, 0)),
        farm_name: farm?.name,
      };
    });

    return [
      ...farms.map((f) => ({
        id: f.id,
        name: f.name,
        label: f.name,
        lat: Number(f.lat),
        lng: Number(f.lng),
        status: f.health_status,
        area_ha: Number(f.area_ha) > 0 ? Number(f.area_ha) : 1,
        kind: "farm" as const,
        color: undefined as string | undefined,
        farm_name: undefined as string | undefined,
      })),
      ...plotPins,
    ];
  }, [farms, plots]);

  const selected = pins.find((p) => p.id === selectedId) ?? null;

  const nextPlotCoords = (farmId: string) => {
    const farm = farms.find((f) => f.id === farmId) ?? farms[0];
    const siblings = plots.filter((p) => p.farm_id === (farm?.id ?? farmId));
    const base = offsetPlotCenter(
      Number(farm?.lat ?? -1.0547),
      Number(farm?.lng ?? -80.4545),
      siblings.length,
      1
    );
    return base;
  };

  const onCreatePlot = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      const farmId = String(fd.get("farm_id"));
      const area = Number(fd.get("area_ha") || 1);
      const auto = nextPlotCoords(farmId);
      const created = await createPlot({
        farm_id: farmId,
        name: String(fd.get("name")),
        area_ha: area,
        lat: Number(fd.get("lat") || auto.lat),
        lng: Number(fd.get("lng") || auto.lng),
      });
      setShowPlot(false);
      await reload();
      setSelectedId(created.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-leaf">Geolocalización</p>
          <h1 className="font-display text-3xl text-forest mt-1">Mapa de fincas y parcelas</h1>
          <p className="text-sm text-ink/60 mt-1">
            Cada lote se dibuja en su propio cuadro con color distinto. Selecciona uno para enfocarlo.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowPlot((v) => !v)}
          className="rounded-xl bg-leaf px-3 py-2 text-sm font-medium text-white hover:bg-leaf-dark"
        >
          + Agregar lote
        </button>
      </header>

      {error && (
        <p className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {showPlot && (
        <form
          onSubmit={onCreatePlot}
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
          <label className="block space-y-1">
            <span className="text-xs text-ink/50">Nombre del lote</span>
            <input
              name="name"
              required
              placeholder="Lote Norte"
              className="w-full rounded-xl border border-forest/15 bg-white px-3 py-2"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-ink/50">Área (ha)</span>
            <input
              name="area_ha"
              type="number"
              step="0.1"
              defaultValue="1"
              className="w-full rounded-xl border border-forest/15 bg-white px-3 py-2"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-ink/50">Lat</span>
            <input
              name="lat"
              type="number"
              step="0.0001"
              defaultValue={farms[0]?.lat ?? -1.0547}
              className="w-full rounded-xl border border-forest/15 bg-white px-3 py-2"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-ink/50">Lng</span>
            <input
              name="lng"
              type="number"
              step="0.0001"
              defaultValue={farms[0]?.lng ?? -80.4545}
              className="w-full rounded-xl border border-forest/15 bg-white px-3 py-2"
            />
          </label>
          <div className="sm:col-span-2 flex gap-2">
            <button
              disabled={busy || farms.length === 0}
              type="submit"
              className="rounded-xl bg-forest px-4 py-2 text-cream text-sm disabled:opacity-40"
            >
              Guardar parcela
            </button>
            <button
              type="button"
              onClick={() => setShowPlot(false)}
              className="rounded-xl px-4 py-2 text-sm text-ink/60"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {pins.length === 0 ? (
        <p className="text-sm text-ink/55 rounded-2xl border border-dashed border-forest/20 bg-cream px-4 py-10 text-center">
          Sin fincas aún. Crea una en Cultivos o completa el onboarding.
        </p>
      ) : (
        <div className="space-y-2">
          {selected && (
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink/55 rounded-xl border border-leaf/20 bg-leaf/5 px-3 py-2">
              <p>
                Solo se muestra:{" "}
                <strong className="text-forest">{selected.label ?? selected.name}</strong>
                {selected.area_ha != null && (
                  <> · <strong>{selected.area_ha} ha</strong></>
                )}
              </p>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="rounded-lg border border-forest/15 bg-white px-2.5 py-1 text-xs text-forest hover:bg-mist"
              >
                Ver todos
              </button>
            </div>
          )}
          <FarmMap farms={pins} height={480} selectedId={selectedId} />
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <ul className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-ink/45">Fincas</p>
          {farms.map((f) => (
            <li key={f.id}>
              <button
                type="button"
                onClick={() => setSelectedId(f.id)}
                className={cn(
                  "w-full text-left rounded-2xl border px-4 py-3 text-sm transition-colors",
                  selectedId === f.id
                    ? "border-leaf bg-leaf/10 ring-1 ring-leaf/30"
                    : "border-forest/10 bg-cream hover:border-leaf/30"
                )}
              >
                <p className="font-medium text-forest">{f.name}</p>
                <p className="text-xs text-ink/50 capitalize mt-0.5">
                  Estado: {f.health_status} · {f.area_ha} ha
                </p>
              </button>
            </li>
          ))}
        </ul>
        <ul className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-ink/45">Lotes / parcelas</p>
          {plots.length === 0 && (
            <li className="text-sm text-ink/45 rounded-2xl border border-dashed border-forest/15 px-4 py-6 text-center">
              Sin lotes. Usa «+ Agregar lote».
            </li>
          )}
          {plots.map((p, i) => {
            const pin = pins.find((x) => x.id === p.id);
            const farm = farms.find((f) => f.id === p.farm_id);
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  className={cn(
                    "w-full text-left rounded-2xl border px-4 py-3 text-sm transition-colors",
                    selectedId === p.id
                      ? "border-leaf bg-leaf/10 ring-1 ring-leaf/30"
                      : "border-forest/10 bg-cream hover:border-leaf/30"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 shrink-0 rounded-sm border border-black/10"
                      style={{ background: pin?.color ?? plotColor(i) }}
                    />
                    <p className="font-medium text-forest">{p.name}</p>
                  </div>
                  <p className="text-xs text-ink/50 mt-0.5 pl-5">
                    {p.area_ha} ha · {farm?.name ?? "Finca"} · {p.health_status}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
