"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle2, Circle, BookOpen } from "lucide-react";
import {
  getCase,
  getLessons,
  pdfUrl,
  setRecommendationDone,
  type DiagnosisResult,
  type Lesson,
} from "@/lib/api";
import { cn, pct, riskColor } from "@/lib/utils";

export default function DiagnosticoDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [caseData, setCaseData] = useState<DiagnosisResult | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getCase(id)
      .then(async (data) => {
        setCaseData(data);
        try {
          const ls = await getLessons(data.detection.disease);
          setLessons(ls.slice(0, 2));
        } catch {
          /* optional */
        }
      })
      .catch((e) => setError(e.message));
  }, [id]);

  const toggleRec = async (recId: string, completed: boolean) => {
    if (!caseData) return;
    setBusyId(recId);
    try {
      await setRecommendationDone(recId, completed);
      setCaseData({
        ...caseData,
        recommendations: caseData.recommendations.map((r) =>
          r.id === recId ? { ...r, completed } : r
        ),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo actualizar");
    } finally {
      setBusyId(null);
    }
  };

  if (error && !caseData) {
    return (
      <div className="space-y-4 animate-fade-up">
        <p className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          {error}
        </p>
        <Link href="/diagnosticos" className="text-leaf text-sm underline">
          Volver al historial
        </Link>
      </div>
    );
  }

  if (!caseData) {
    return <p className="text-sm text-ink/50 animate-pulse">Cargando diagnóstico…</p>;
  }

  const d = caseData.detection;
  const done = caseData.recommendations.filter((r) => r.completed).length;
  const total = caseData.recommendations.length;

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-up">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/diagnosticos" className="text-xs text-leaf hover:underline">
            ← Historial
          </Link>
          <h1 className="font-display text-3xl text-forest mt-1">{d.disease}</h1>
          <p className="text-sm text-ink/60 mt-1">
            {d.crop} · {format(new Date(caseData.created_at), "dd MMM yyyy HH:mm", { locale: es })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-md border px-2 py-1 text-[10px] font-semibold uppercase",
              riskColor(d.risk_level)
            )}
          >
            {d.risk_level}
          </span>
          <a
            href={pdfUrl(caseData.id)}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-forest px-3 py-2 text-xs font-medium text-cream"
          >
            Descargar PDF
          </a>
        </div>
      </header>

      <section className="rounded-2xl border border-forest/10 bg-cream p-5 space-y-3">
        <div className="flex flex-wrap gap-4 text-sm">
          <p>
            Confianza <strong>{pct(d.confidence)}</strong>
          </p>
          <p>
            Parte afectada <strong>{d.affected_part}</strong>
          </p>
          <p>
            Clima <strong>{caseData.weather.condition}</strong> ({caseData.weather.humidity_pct}%
            humedad)
          </p>
        </div>
        <p className="text-sm text-ink/80 leading-relaxed">{caseData.diagnosis}</p>
        <p className="text-xs text-ink/45">{d.rationale}</p>
      </section>

      <section className="rounded-2xl border border-forest/10 bg-cream p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-forest">Plan de tratamiento</h2>
          <span className="text-xs text-ink/50">
            {done}/{total} hechas
          </span>
        </div>
        <ul className="space-y-2">
          {caseData.recommendations.map((r, i) => {
            const recId = r.id;
            const completed = Boolean(r.completed);
            return (
              <li
                key={recId ?? `${r.title}-${i}`}
                className={cn(
                  "flex gap-3 rounded-xl border px-3 py-3 text-sm",
                  completed ? "border-leaf/30 bg-leaf/5" : "border-forest/10 bg-white"
                )}
              >
                {recId ? (
                  <button
                    type="button"
                    disabled={busyId === recId}
                    onClick={() => toggleRec(recId, !completed)}
                    className="shrink-0 mt-0.5 text-leaf disabled:opacity-40"
                    aria-label={completed ? "Marcar pendiente" : "Marcar hecha"}
                  >
                    {completed ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5 text-ink/30" />
                    )}
                  </button>
                ) : (
                  <Circle className="h-5 w-5 text-ink/20 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={cn("font-medium", completed && "line-through text-ink/50")}>
                    {r.title}
                  </p>
                  <p className="text-xs text-ink/55 mt-0.5">{r.detail}</p>
                  <p className="text-[10px] uppercase tracking-wide text-ink/40 mt-1">
                    {r.timeframe} · prioridad {r.priority}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        {caseData.follow_up?.steps?.length > 0 && (
          <div className="pt-2 border-t border-forest/8">
            <p className="text-xs font-medium text-ink/50 mb-1">
              Seguimiento en {caseData.follow_up.check_in_hours} h
            </p>
            <ul className="text-xs text-ink/60 list-disc pl-4 space-y-0.5">
              {caseData.follow_up.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <Link
              href="/escanear"
              className="inline-block mt-3 text-xs font-medium text-leaf underline"
            >
              Tomar foto de seguimiento
            </Link>
          </div>
        )}
      </section>

      {lessons.length > 0 && (
        <section className="rounded-2xl border border-forest/10 bg-cream p-5 space-y-3">
          <h2 className="font-display text-xl text-forest flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-leaf" /> Aprende sobre esto
          </h2>
          <ul className="space-y-2">
            {lessons.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/capacitacion?lesson=${l.slug}`}
                  className="block rounded-xl border border-forest/10 bg-white px-4 py-3 hover:border-leaf/40"
                >
                  <p className="text-sm font-medium text-forest">{l.title}</p>
                  <p className="text-xs text-ink/50 mt-0.5">
                    {l.duration_min} min · {l.crop}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
