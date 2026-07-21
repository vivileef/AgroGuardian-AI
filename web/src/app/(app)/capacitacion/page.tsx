"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { BookOpen, Sprout } from "lucide-react";
import { getLessons, type Lesson } from "@/lib/api";

function LessonBody({ md }: { md: string }) {
  const blocks = md.split(/\n\n+/);
  return (
    <div className="space-y-3 text-sm text-ink/75 leading-relaxed">
      {blocks.map((b, i) => {
        if (b.startsWith("## ")) {
          return (
            <h3 key={i} className="font-display text-lg text-forest pt-1">
              {b.replace(/^## /, "")}
            </h3>
          );
        }
        if (/^\d+\./.test(b)) {
          return (
            <ol key={i} className="list-decimal pl-5 space-y-1">
              {b.split("\n").map((line) => (
                <li key={line}>{line.replace(/^\d+\.\s*/, "")}</li>
              ))}
            </ol>
          );
        }
        return (
          <p key={i} className="whitespace-pre-wrap">
            {b}
          </p>
        );
      })}
    </div>
  );
}

function CapacitacionInner() {
  const search = useSearchParams();
  const lessonSlug = search.get("lesson");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [active, setActive] = useState<Lesson | null>(null);

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

  const list = useMemo(() => lessons, [lessons]);

  return (
    <div className="space-y-6 animate-fade-up">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-leaf">Aprendizaje</p>
        <h1 className="font-display text-3xl text-forest mt-1">Capacitación</h1>
        <p className="text-sm text-ink/60 mt-1">
          Lecciones cortas en español, útiles cuando detectas una plaga en campo.
        </p>
      </header>

      <div className="rounded-2xl border border-leaf/20 bg-leaf/5 p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <Sprout className="h-10 w-10 text-leaf shrink-0" />
        <div className="flex-1">
          <h2 className="font-display text-xl text-forest">Aprende al momento del problema</h2>
          <p className="text-sm text-ink/60 mt-1">
            Tras un diagnóstico, te sugerimos la lección de esa enfermedad.
          </p>
        </div>
        <Link
          href="/escanear"
          className="rounded-xl bg-leaf px-4 py-2.5 text-sm font-medium text-white hover:bg-leaf-dark shrink-0"
        >
          Practicar con escaneo
        </Link>
      </div>

      {active ? (
        <article className="rounded-2xl border border-forest/10 bg-cream p-5 space-y-4">
          <button
            type="button"
            onClick={() => setActive(null)}
            className="text-xs text-leaf hover:underline"
          >
            ← Todas las lecciones
          </button>
          <h2 className="font-display text-2xl text-forest">{active.title}</h2>
          <p className="text-xs text-ink/45">
            {active.duration_min} min · {active.crop}
          </p>
          <LessonBody md={active.content_md} />
        </article>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((c) => (
            <article
              key={c.id}
              className="rounded-2xl border border-forest/10 bg-cream p-5 hover:border-leaf/30 transition-colors"
            >
              <BookOpen className="h-5 w-5 text-leaf" />
              <h3 className="font-display text-lg text-forest mt-3">{c.title}</h3>
              <p className="text-xs text-ink/50 mt-2">
                {c.crop} · {c.duration_min} min
              </p>
              <button
                type="button"
                onClick={() => setActive(c)}
                className="mt-4 text-sm text-leaf font-medium hover:underline"
              >
                Iniciar lección
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CapacitacionPage() {
  return (
    <Suspense fallback={<p className="text-sm text-ink/50">Cargando…</p>}>
      <CapacitacionInner />
    </Suspense>
  );
}
