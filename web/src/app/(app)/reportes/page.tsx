"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getReportSummary, pdfUrl } from "@/lib/api";
import { cn, riskColor } from "@/lib/utils";

export default function ReportesPage() {
  const [days, setDays] = useState(30);
  const [summary, setSummary] = useState<Awaited<
    ReturnType<typeof getReportSummary>
  > | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getReportSummary(days)
      .then(setSummary)
      .catch((e) => setError(e.message));
  }, [days]);

  return (
    <div className="space-y-6 animate-fade-up">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-leaf">Documentación</p>
          <h1 className="font-display text-3xl text-forest mt-1">Reportes</h1>
          <p className="text-sm text-ink/60 mt-1">
            Resumen del periodo para el técnico, la cooperativa o el crédito.
          </p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-xl border border-forest/15 bg-white px-3 py-2 text-sm"
        >
          <option value={7}>Últimos 7 días</option>
          <option value={30}>Últimos 30 días</option>
          <option value={90}>Últimos 90 días</option>
        </select>
      </header>

      {error && (
        <p className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {summary && (
        <>
          <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Escaneos", value: summary.scans },
              { label: "Tratamientos hechos", value: summary.treatments_done },
              { label: "Pendientes", value: summary.treatments_pending },
              {
                label: "Enfermedades distintas",
                value: Object.keys(summary.by_disease).length,
              },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl border border-forest/10 bg-cream p-4">
                <p className="text-xs text-ink/50">{m.label}</p>
                <p className="mt-1 font-display text-3xl text-forest">{m.value}</p>
              </div>
            ))}
          </section>

          {Object.keys(summary.by_disease).length > 0 && (
            <section className="rounded-2xl border border-forest/10 bg-cream p-5">
              <h2 className="font-display text-xl text-forest mb-3">Por enfermedad</h2>
              <ul className="space-y-2">
                {Object.entries(summary.by_disease)
                  .sort((a, b) => b[1] - a[1])
                  .map(([name, count]) => (
                    <li
                      key={name}
                      className="flex justify-between rounded-xl bg-white border border-forest/8 px-4 py-2 text-sm"
                    >
                      <span>{name}</span>
                      <span className="font-medium text-forest">{count}</span>
                    </li>
                  ))}
              </ul>
            </section>
          )}

          <section className="rounded-2xl border border-forest/10 bg-cream p-5 space-y-3">
            <h2 className="font-display text-xl text-forest">Casos recientes</h2>
            {summary.recent.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <FileText className="mx-auto h-10 w-10 text-leaf" />
                <p className="text-sm text-ink/60">Sin escaneos en este periodo.</p>
                <Link
                  href="/escanear"
                  className="inline-flex rounded-xl bg-leaf px-5 py-2.5 text-sm font-medium text-white"
                >
                  Crear diagnóstico
                </Link>
              </div>
            ) : (
              <ul className="space-y-2">
                {summary.recent.map((c) => (
                  <li
                    key={c.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-forest/8 bg-white px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-forest">{c.disease}</p>
                      <p className="text-xs text-ink/45">
                        {format(new Date(c.created_at), "dd MMM yyyy", { locale: es })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase",
                          riskColor(c.risk_level)
                        )}
                      >
                        {c.risk_level}
                      </span>
                      <Link href={`/diagnosticos/${c.id}`} className="text-xs text-leaf underline">
                        Ver
                      </Link>
                      <a
                        href={pdfUrl(c.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-ink/50 underline"
                      >
                        PDF
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
