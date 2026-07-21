"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Bell, ChevronDown, Search, Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getFarms,
  getNotifications,
  getWeather,
  markNotificationRead,
  type AppNotification,
  type Farm,
  type WeatherSnapshot,
} from "@/lib/api";
import { cn } from "@/lib/utils";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "¡Hola";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

export function TopBar() {
  const { user } = useUser();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [farmId, setFarmId] = useState<string>("");
  const [showAlerts, setShowAlerts] = useState(false);
  const [alerts, setAlerts] = useState<AppNotification[]>([]);
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);

  useEffect(() => {
    getFarms()
      .then((data) => {
        setFarms(data);
        if (data.length && !farmId) setFarmId(data[0].id);
      })
      .catch(() => setFarms([]));
    getNotifications()
      .then(setAlerts)
      .catch(() => setAlerts([]));
    getWeather()
      .then(setWeather)
      .catch(() => null);
  }, [farmId]);

  const firstName = user?.firstName || "Juan";
  const selectedFarm = farms.find((f) => f.id === farmId) ?? farms[0];
  const unread = alerts.filter((a) => !a.read).length;
  const today = new Date().toLocaleDateString("es-EC", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const onOpenAlert = async (a: AppNotification) => {
    if (a.read) return;
    try {
      await markNotificationRead(a.id);
      setAlerts((prev) => prev.map((x) => (x.id === a.id ? { ...x, read: true } : x)));
    } catch {
      /* ignore */
    }
  };

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 lg:px-4">
      <div className="glass rounded-2xl px-4 py-3 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-lg sm:text-xl text-white truncate">
              {greeting()}, {firstName}{" "}
              <span className="inline-block" aria-hidden>
                👋
              </span>
            </h2>
            <p className="text-[11px] sm:text-xs text-muted truncate mt-0.5">
              {selectedFarm?.name ?? "Tu finca"} · Portoviejo, Manabí
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-3 text-[11px] text-muted">
              <div className="text-right leading-tight">
                <p className="text-white/80 capitalize">{today}</p>
                <p className="text-[10px] text-neon/80">Actualizado ahora</p>
              </div>
              {weather && (
                <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5 ring-1 ring-white/10">
                  <span className="text-lg">⛅</span>
                  <div className="leading-tight">
                    <p className="text-white font-semibold">{weather.temperature_c}°C</p>
                    <p className="text-[10px] truncate max-w-[110px]">{weather.condition}</p>
                  </div>
                </div>
              )}
            </div>

            {selectedFarm && (
              <div className="relative hidden xl:block">
                <select
                  value={farmId}
                  onChange={(e) => setFarmId(e.target.value)}
                  className="appearance-none rounded-xl bg-white/5 ring-1 ring-white/10 pl-3 pr-8 py-2 text-xs text-white outline-none focus:ring-neon/40"
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id} className="bg-navy text-white">
                      {f.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
              </div>
            )}

            <button
              type="button"
              className="hidden sm:grid h-9 w-9 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 text-muted hover:text-neon"
              aria-label="Buscar"
            >
              <Search className="h-4 w-4" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAlerts((v) => !v)}
                className="relative grid h-9 w-9 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 text-muted hover:text-neon"
                aria-label="Notificaciones"
              >
                <Bell className="h-4 w-4" />
                {unread > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[9px] font-bold text-white">
                    {unread}
                  </span>
                )}
              </button>
              {showAlerts && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-40"
                    aria-label="Cerrar"
                    onClick={() => setShowAlerts(false)}
                  />
                  <div className="absolute right-0 top-11 z-50 w-72 glass-strong rounded-2xl p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted mb-2">
                      Alertas recientes
                    </p>
                    <ul className="space-y-2 max-h-64 overflow-y-auto">
                      {alerts.length === 0 && (
                        <li className="text-xs text-muted px-2 py-4 text-center">
                          Sin alertas por ahora
                        </li>
                      )}
                      {alerts.map((a) => (
                        <li key={a.id}>
                          <button
                            type="button"
                            onClick={() => onOpenAlert(a)}
                            className={cn(
                              "w-full text-left rounded-xl px-3 py-2 text-xs",
                              a.read ? "bg-white/3" : "bg-neon/10 ring-1 ring-neon/20"
                            )}
                          >
                            <p className="font-medium text-white">{a.title}</p>
                            {a.body && <p className="text-muted mt-0.5">{a.body}</p>}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>

            <Link
              href="/configuracion"
              className="hidden sm:grid h-9 w-9 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 text-muted hover:text-neon"
              aria-label="Configuración"
            >
              <Settings className="h-4 w-4" />
            </Link>

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9 ring-2 ring-neon/30",
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
