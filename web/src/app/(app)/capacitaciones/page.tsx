"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  GraduationCap,
  PlayCircle,
  Search,
} from "lucide-react";
import {
  CAPACITACION_CATEGORIES,
  CAPACITACION_MODULES,
  type CapacitacionModule,
} from "@/lib/capacitaciones-data";
import { cn } from "@/lib/utils";

export default function CapacitacionesPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [category, setCategory] = useState("Todas");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 12;

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CAPACITACION_MODULES.filter((m) => {
      const catOk = category === "Todas" || m.category === category;
      const textOk =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q);
      return catOk && textOk;
    });
  }, [category, query]);

  const pageCount = Math.max(1, Math.ceil(list.length / pageSize));
  const pageItems = list.slice(page * pageSize, page * pageSize + pageSize);
  const active: CapacitacionModule | null =
    CAPACITACION_MODULES.find((m) => m.id === activeId) ?? null;
  const completedCount = Object.values(done).filter(Boolean).length;

  return (
    <div className="space-y-6 animate-fade-up">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-leaf">Formación</p>
          <h1 className="font-display text-3xl text-forest mt-1">Capacitaciones agronómicas</h1>
          <p className="text-sm text-ink/60 mt-1">
            {CAPACITACION_MODULES.length} módulos prácticos con video, objetivos y pasos de campo.
          </p>
        </div>
        <div className="rounded-xl border border-forest/10 bg-cream px-3 py-2 text-xs text-ink/60">
          Completados: <strong className="text-forest">{completedCount}</strong> /{" "}
          {CAPACITACION_MODULES.length}
        </div>
      </header>

      <div className="rounded-2xl border border-leaf/20 bg-leaf/5 p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <GraduationCap className="h-10 w-10 text-leaf shrink-0" />
        <div className="flex-1">
          <h2 className="font-display text-xl text-forest">Aprende con video y aplícalo en tu lote</h2>
          <p className="text-sm text-ink/60 mt-1">
            Cada módulo incluye un video educativo, objetivos claros y pasos numerados para ejecutar en campo.
          </p>
        </div>
        <Link
          href="/enciclopedia"
          className="rounded-xl border border-forest/15 bg-white px-4 py-2.5 text-sm hover:bg-mist shrink-0"
        >
          Ir a Enciclopedia
        </Link>
      </div>

      {active ? (
        <article className="rounded-2xl border border-forest/10 bg-cream p-4 sm:p-6 space-y-5">
          <button
            type="button"
            onClick={() => setActiveId(null)}
            className="text-xs text-leaf hover:underline"
          >
            ← Todos los módulos
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-leaf/25 bg-leaf/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-leaf-dark">
              Módulo {active.number}
            </span>
            <span className="rounded-md border border-forest/15 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase text-ink/60">
              {active.category}
            </span>
            <span className="text-xs text-ink/45">
              {active.level} · {active.duration_min} min
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl text-forest">{active.title}</h2>
          <p className="text-sm sm:text-[15px] text-ink/75 leading-relaxed">{active.summary}</p>

          <section className="space-y-2">
            <h3 className="text-xs uppercase tracking-[0.16em] text-ink/45 flex items-center gap-2">
              <PlayCircle className="h-4 w-4 text-leaf" /> Video del módulo
            </h3>
            <div className="overflow-hidden rounded-xl border border-forest/10 bg-black aspect-video">
              <iframe
                title={active.video.label}
                src={`https://www.youtube-nocookie.com/embed/${active.video.youtubeId}`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-[11px] text-ink/45">{active.video.label}</p>
          </section>

          <section>
            <h3 className="text-xs uppercase tracking-[0.16em] text-ink/45 mb-2">Objetivos</h3>
            <ul className="space-y-2">
              {active.objectives.map((o) => (
                <li
                  key={o}
                  className="rounded-xl border border-forest/10 bg-white px-3 py-2 text-sm text-ink/70"
                >
                  {o}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3 border-t border-forest/10 pt-5">
            <h3 className="font-display text-xl text-forest">Pasos del módulo</h3>
            <ol className="space-y-3">
              {active.steps.map((step, index) => (
                <li
                  key={`${active.id}-${index}`}
                  className="flex gap-3 rounded-xl border border-forest/10 bg-white px-3 py-3 sm:px-4"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-leaf/15 text-sm font-semibold text-leaf-dark">
                    {index + 1}
                  </span>
                  <p className="text-sm text-ink/75 leading-relaxed pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <button
            type="button"
            onClick={() =>
              setDone((prev) => ({ ...prev, [active.id]: !prev[active.id] }))
            }
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium",
              done[active.id]
                ? "bg-leaf text-white"
                : "border border-forest/15 bg-white hover:bg-mist"
            )}
          >
            {done[active.id] ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Circle className="h-4 w-4" />
            )}
            {done[active.id] ? "Módulo completado" : "Marcar como completado"}
          </button>
        </article>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(0);
                }}
                placeholder="Buscar módulo…"
                className="w-full rounded-xl border border-forest/15 bg-white py-2.5 pl-9 pr-3 text-sm"
              />
            </label>
            <p className="text-xs text-ink/45 shrink-0">{list.length} resultados</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Todas", ...CAPACITACION_CATEGORIES].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCategory(c);
                  setPage(0);
                }}
                className={cn(
                  "rounded-xl px-3 py-1.5 text-xs font-medium border transition-colors",
                  category === c
                    ? "bg-forest text-cream border-forest"
                    : "bg-white text-ink/70 border-forest/15 hover:bg-mist"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {pageItems.map((m) => (
              <article
                key={m.id}
                className="rounded-2xl border border-forest/10 bg-cream p-5 hover:border-leaf/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-md border border-forest/10 bg-white px-2 py-0.5 text-[10px] font-semibold text-ink/55">
                    #{m.number}
                  </span>
                  {done[m.id] ? (
                    <CheckCircle2 className="h-5 w-5 text-leaf" />
                  ) : (
                    <PlayCircle className="h-5 w-5 text-leaf/70" />
                  )}
                </div>
                <p className="text-[10px] uppercase tracking-wide text-ink/45 mt-3">
                  {m.category} · {m.level}
                </p>
                <h3 className="font-display text-lg text-forest mt-1 line-clamp-2">{m.title}</h3>
                <p className="text-xs text-ink/55 mt-2 line-clamp-3">{m.summary}</p>
                <p className="text-[11px] text-ink/40 mt-2">
                  {m.duration_min} min · video incluido · {m.steps.length} pasos
                </p>
                <button
                  type="button"
                  onClick={() => setActiveId(m.id)}
                  className="mt-4 text-sm text-leaf font-medium hover:underline"
                >
                  Abrir módulo y ver video
                </button>
              </article>
            ))}
          </div>

          {pageCount > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="rounded-xl border border-forest/15 px-3 py-1.5 text-xs disabled:opacity-40"
              >
                Anterior
              </button>
              <span className="text-xs text-ink/50">
                Página {page + 1} / {pageCount}
              </span>
              <button
                type="button"
                disabled={page >= pageCount - 1}
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                className="rounded-xl border border-forest/15 px-3 py-1.5 text-xs disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
