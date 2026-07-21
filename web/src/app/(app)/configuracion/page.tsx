"use client";

import { useEffect, useState } from "react";
import { getHealth } from "@/lib/api";

export default function ConfigPage() {
  const [health, setHealth] = useState<{
    status: string;
    demo_mode: boolean;
    openrouter: boolean;
    openweather: boolean;
    supabase: boolean;
    models: { text: string; vision: string };
  } | null>(null);

  useEffect(() => {
    getHealth()
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  return (
    <div className="max-w-xl space-y-6 animate-fade-up">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-leaf">Sistema</p>
        <h1 className="font-display text-3xl text-forest mt-1">Configuración</h1>
      </header>

      <div className="rounded-2xl border border-forest/10 bg-cream p-5 space-y-4 text-sm">
        <h2 className="font-medium text-forest">Estado de la API (Next.js)</h2>
        {health ? (
          <ul className="space-y-2 text-ink/70">
            <li>
              API: <strong className="text-leaf">{health.status}</strong>
            </li>
            <li>Demo mode: {health.demo_mode ? "sí" : "no"}</li>
            <li>OpenRouter: {health.openrouter ? "conectado" : "sin clave"}</li>
            <li>
              Modelo texto: <code className="text-xs">{health.models?.text}</code>
            </li>
            <li>
              Modelo visión: <code className="text-xs">{health.models?.vision}</code>
            </li>
            <li>OpenWeather: {health.openweather ? "conectado" : "usando Open-Meteo"}</li>
            <li>Supabase: {health.supabase ? "conectado" : "modo demo local"}</li>
          </ul>
        ) : (
          <p className="text-amber-800">
            API no alcanzable. Verifica que la app esté corriendo.
          </p>
        )}

        <div className="pt-2 border-t border-forest/10 space-y-2 text-xs text-ink/55">
          <p>
            Copia <code>web/.env.example</code> → <code>web/.env.local</code> (o variables en Vercel) con
            Clerk, Supabase y OpenRouter. La API corre en el mismo dominio (<code>/api/*</code>).
          </p>
          <p>
            PWA: instala desde el navegador (manifest + service worker). Muestras demo en Escanear.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-forest/10 bg-cream p-5 space-y-3 text-sm">
        <h2 className="font-medium text-forest">Integraciones</h2>
        <ul className="space-y-2 text-ink/70 text-xs">
          <li>
            <strong>Clerk</strong> — autenticación y perfil de usuario
          </li>
          <li>
            <strong>Supabase</strong> — fincas, cultivos, diagnósticos, notificaciones
          </li>
          <li>
            <strong>OpenRouter</strong> — agentes IA (visión + agrónomo + chat)
          </li>
          <li>
            <strong>Open-Meteo</strong> — clima gratuito para Manabí
          </li>
        </ul>
      </div>
    </div>
  );
}
