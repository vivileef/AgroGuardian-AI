"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { BookOpen, Bug, Leaf, ShieldCheck, Sprout } from "lucide-react";
import { getLessons, type Lesson } from "@/lib/api";
import { cn } from "@/lib/utils";

const TYPE_STYLE: Record<string, string> = {
  Hongo: "bg-amber-50 text-amber-900 border-amber-200",
  Bacteria: "bg-rose-50 text-rose-900 border-rose-200",
  Virus: "bg-violet-50 text-violet-900 border-violet-200",
  Plaga: "bg-orange-50 text-orange-900 border-orange-200",
  Fisiopatia: "bg-sky-50 text-sky-900 border-sky-200",
};

function EnciclopediaInner() {
  const search = useSearchParams();
  const lessonSlug = search.get("lesson");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [active, setActive] = useState<Lesson | null>(null);
  const [cropFilter, setCropFilter] = useState<string>("Todos");
  const [typeFilter, setTypeFilter] = useState<string>("Todos");

  useEffect(() => {
    getLessons()
      .then((rows) => {
        setLessons(rows);
        if (lessonSlug) {
          setActive(rows.find((l) => l.slug === lessonSlug) ?? rows[0] ?? null);
        }
      })
      .catch(() => null);
  }, [lessonSlug]);

  const crops = useMemo(() => {
    const set = new Set(lessons.map((l) => l.crop || "General"));
    return ["Todos", ...Array.from(set)];
  }, [lessons]);

  const types = useMemo(() => {
    const set = new Set(lessons.map((l) => l.infection_type || "Hongo"));
    return ["Todos", ...Array.from(set)];
  }, [lessons]);

  const list = useMemo(() => {
    return lessons.filter((l) => {
      const cropOk = cropFilter === "Todos" || (l.crop || "General") === cropFilter;
      const typeOk = typeFilter === "Todos" || (l.infection_type || "Hongo") === typeFilter;
      return cropOk && typeOk;
    });
  }, [lessons, cropFilter, typeFilter]);

  return (
    <div className="space-y-6 animate-fade-up">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-leaf">Conocimiento</p>
        <h1 className="font-display text-3xl text-forest mt-1">Enciclopedia</h1>
        <p className="text-sm text-ink/60 mt-1">
          Tipos de infección por cultivo, con imágenes de referencia para comparar en campo.
        </p>
      </header>

      <div className="rounded-2xl border border-leaf/20 bg-leaf/5 p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <Sprout className="h-10 w-10 text-leaf shrink-0" />
        <div className="flex-1">
          <h2 className="font-display text-xl text-forest">Compara tu planta con la referencia</h2>
          <p className="text-sm text-ink/60 mt-1">
            Cada ficha indica el tipo de infección y muestra una foto guía con pasos claros de prevención.
          </p>
        </div>
        <Link
          href="/escanear"
          className="rounded-xl bg-leaf px-4 py-2.5 text-sm font-medium text-white hover:bg-leaf-dark shrink-0"
        >
          Escanear y diagnosticar
        </Link>
      </div>

      {active ? (
        <article className="rounded-2xl border border-forest/10 bg-cream p-4 sm:p-6 space-y-6">
          <button
            type="button"
            onClick={() => setActive(null)}
            className="text-xs text-leaf hover:underline"
          >
            ← Toda la enciclopedia
          </button>

          <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-start">
            <figure className="mx-auto w-full max-w-[220px]">
              <div className="relative aspect-square overflow-hidden rounded-xl border border-forest/10 bg-mist shadow-sm">
                <Image
                  src={active.image_src || "/samples/sigatoka.jpg"}
                  alt={active.image_alt || active.title}
                  fill
                  className="object-cover"
                  sizes="220px"
                  unoptimized
                />
              </div>
              <figcaption className="mt-2 text-center text-[11px] text-ink/45 leading-snug">
                Imagen de referencia · {active.crop}
              </figcaption>
            </figure>

            <div className="space-y-4 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase",
                    TYPE_STYLE[active.infection_type || "Hongo"]
                  )}
                >
                  {active.infection_type || "Hongo"}
                </span>
                <span className="text-xs text-ink/45">{active.crop}</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl text-forest leading-tight">
                {active.title}
              </h2>

              <section>
                <h3 className="text-xs uppercase tracking-[0.16em] text-ink/45 mb-2">
                  Descripción técnica
                </h3>
                <p className="text-sm sm:text-[15px] text-ink/75 leading-relaxed">
                  {active.description ||
                    "Consulta los síntomas y los pasos de prevención recomendados para este caso."}
                </p>
              </section>

              {active.symptoms && active.symptoms.length > 0 && (
                <section>
                  <h3 className="text-xs uppercase tracking-[0.16em] text-ink/45 mb-2">
                    Síntomas típicos
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {active.symptoms.map((s) => (
                      <li
                        key={s}
                        className="rounded-lg border border-forest/10 bg-white px-2.5 py-1.5 text-xs text-ink/70"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>

          {active.prevention_steps && active.prevention_steps.length > 0 && (
            <section className="space-y-3 border-t border-forest/10 pt-5">
              <h3 className="font-display text-xl text-forest flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-leaf" />
                Pasos para evitar esta enfermedad
              </h3>
              <ol className="space-y-3">
                {active.prevention_steps.map((step, index) => (
                  <li
                    key={`${index}-${step.slice(0, 24)}`}
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
          )}
        </article>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {crops.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCropFilter(c)}
                  className={cn(
                    "rounded-xl px-3 py-1.5 text-xs font-medium border transition-colors",
                    cropFilter === c
                      ? "bg-forest text-cream border-forest"
                      : "bg-white text-ink/70 border-forest/15 hover:bg-mist"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  className={cn(
                    "rounded-xl px-3 py-1.5 text-xs font-medium border transition-colors",
                    typeFilter === t
                      ? "bg-leaf text-white border-leaf"
                      : "bg-white text-ink/70 border-forest/15 hover:bg-mist"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {list.map((c) => (
              <article
                key={c.id}
                className="rounded-2xl border border-forest/10 bg-cream overflow-hidden hover:border-leaf/30 transition-colors"
              >
                <div className="relative aspect-[4/3] bg-mist">
                  <Image
                    src={c.image_src || "/samples/sigatoka.jpg"}
                    alt={c.image_alt || c.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                    unoptimized
                  />
                  <span
                    className={cn(
                      "absolute left-3 top-3 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase backdrop-blur-sm",
                      TYPE_STYLE[c.infection_type || "Hongo"]
                    )}
                  >
                    {c.infection_type || "Hongo"}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-leaf">
                    {c.infection_type === "Plaga" ? (
                      <Bug className="h-4 w-4" />
                    ) : c.infection_type === "Fisiopatia" ? (
                      <Leaf className="h-4 w-4" />
                    ) : (
                      <BookOpen className="h-4 w-4" />
                    )}
                    <p className="text-[10px] uppercase tracking-wide text-ink/45">{c.crop}</p>
                  </div>
                  <h3 className="font-display text-lg text-forest mt-1">{c.title}</h3>
                  {c.description && (
                    <p className="text-xs text-ink/55 mt-2 line-clamp-2">{c.description}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setActive(c)}
                    className="mt-3 text-sm text-leaf font-medium hover:underline"
                  >
                    Ver ficha
                  </button>
                </div>
              </article>
            ))}
            {list.length === 0 && (
              <p className="sm:col-span-2 xl:col-span-3 text-sm text-ink/55 text-center py-10">
                No hay fichas con ese filtro.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function EnciclopediaPage() {
  return (
    <Suspense fallback={<p className="text-sm text-ink/50">Cargando…</p>}>
      <EnciclopediaInner />
    </Suspense>
  );
}
