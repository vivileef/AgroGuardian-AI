"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { deleteCase, getCases, pdfUrl, type DiagnosisResult } from "@/lib/api";
import { cn, pct, riskColor } from "@/lib/utils";

export default function DiagnosticosPage() {
  const [cases, setCases] = useState<DiagnosisResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const reload = () =>
    getCases()
      .then(setCases)
      .catch((e) => setError(e.message));

  useEffect(() => {
    reload();
  }, []);

  const onDelete = async (id: string, disease: string) => {
    if (!window.confirm(`¿Eliminar el diagnóstico «${disease}»?`)) return;
    setBusyId(id);
    setError(null);
    try {
      await deleteCase(id);
      setCases((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo eliminar");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-leaf">Historial</p>
        <h1 className="font-display text-3xl text-forest mt-1">Diagnósticos</h1>
        <p className="text-sm text-ink/60 mt-1">
          Solo casos que escaneaste tú. Puedes regenerarlos o eliminarlos.
        </p>
      </header>

      {error && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {!error && cases.length === 0 && (
        <p className="text-sm text-ink/55 rounded-2xl border border-dashed border-forest/20 bg-cream px-4 py-10 text-center">
          Aún no hay diagnósticos. Ve a{" "}
          <Link href="/escanear" className="text-leaf font-medium underline">
            Escanear
          </Link>{" "}
          y toma una muestra.
        </p>
      )}

      {cases.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-forest/10 bg-cream">
          <table className="min-w-full text-sm">
            <thead className="bg-forest text-cream text-left text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Cultivo</th>
                <th className="px-4 py-3 font-medium">Enfermedad</th>
                <th className="px-4 py-3 font-medium">Confianza</th>
                <th className="px-4 py-3 font-medium">Riesgo</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id} className="border-t border-forest/8">
                  <td className="px-4 py-3 whitespace-nowrap text-ink/70">
                    {format(new Date(c.created_at), "dd MMM yyyy HH:mm", { locale: es })}
                  </td>
                  <td className="px-4 py-3">{c.detection.crop}</td>
                  <td className="px-4 py-3 font-medium">{c.detection.disease}</td>
                  <td className="px-4 py-3">{pct(c.detection.confidence)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase",
                        riskColor(c.detection.risk_level)
                      )}
                    >
                      {c.detection.risk_level}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-3">
                    <Link
                      href={`/diagnosticos/${c.id}`}
                      className="text-leaf hover:underline text-xs font-medium"
                    >
                      Ver
                    </Link>
                    <a
                      href={pdfUrl(c.id)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-ink/50 hover:underline text-xs font-medium"
                    >
                      PDF
                    </a>
                    <button
                      type="button"
                      disabled={busyId === c.id}
                      onClick={() => onDelete(c.id, c.detection.disease)}
                      className="text-red-600/80 hover:underline text-xs font-medium disabled:opacity-40"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
