"use client";

import { useUser } from "@clerk/nextjs";
import { Loader2, Sprout } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const PROVINCES = ["Manabí", "Guayas", "Los Ríos", "Esmeraldas", "Pichincha"];
const CROP_OPTIONS = ["Plátano", "Cacao", "Maíz", "Café", "Arroz"];

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [farmName, setFarmName] = useState("Finca La Esperanza");
  const [province, setProvince] = useState("Manabí");
  const [hectares, setHectares] = useState(5);
  const [crops, setCrops] = useState<string[]>(["Plátano", "Cacao"]);

  useEffect(() => {
    if (!isLoaded) return;
    setFullName(user?.fullName || user?.firstName || "");
    fetch("/api/onboarding")
      .then((r) => r.json())
      .then((d) => {
        if (d.completed) router.replace("/dashboard");
      })
      .finally(() => setChecking(false));
  }, [isLoaded, user, router]);

  const toggleCrop = (c: string) => {
    setCrops((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (crops.length === 0) {
      setError("Selecciona al menos un cultivo.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, farmName, province, hectares, crops }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "No se pudo registrar la finca");
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  if (checking || !isLoaded) {
    return (
      <div className="min-h-dvh bg-field grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-leaf" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-field px-4 py-10">
      <div className="mx-auto max-w-lg animate-fade-up">
        <div className="text-center mb-8">
          <span className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-leaf/15 ring-1 ring-leaf/30 mb-4">
            <Sprout className="h-7 w-7 text-leaf" />
          </span>
          <h1 className="font-display text-3xl text-forest">Configura tu finca</h1>
          <p className="text-sm text-ink/60 mt-2 max-w-md mx-auto">
            Registra los datos esenciales para simular tu operación agrícola en Manabí y acceder al
            panel de AgroGuardian AI.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-2xl border border-forest/10 bg-cream/95 backdrop-blur p-6 sm:p-8 space-y-5 shadow-sm"
        >
          <Field label="Tu nombre">
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClass}
              placeholder="Juan Pérez"
            />
          </Field>

          <Field label="Nombre de la finca">
            <input
              required
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              className={inputClass}
              placeholder="Finca La Esperanza"
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Provincia">
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className={inputClass}
              >
                {PROVINCES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </Field>
            <Field label="Hectáreas">
              <input
                type="number"
                min={0.1}
                step={0.1}
                required
                value={hectares}
                onChange={(e) => setHectares(Number(e.target.value))}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Cultivos principales">
            <div className="flex flex-wrap gap-2 mt-1">
              {CROP_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCrop(c)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm border transition-colors",
                    crops.includes(c)
                      ? "bg-leaf text-white border-leaf"
                      : "bg-white border-forest/15 text-ink hover:border-leaf/40"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </Field>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest py-3.5 text-sm font-semibold text-cream hover:bg-leaf-dark disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Entrar a mi panel
          </button>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "mt-1 w-full rounded-xl border border-forest/12 bg-white px-3 py-2.5 text-sm outline-none focus:border-leaf";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-ink/60">
      {label}
      {children}
    </label>
  );
}
