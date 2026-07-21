"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Bell, ChevronDown, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getFarms,
  getNotifications,
  markNotificationRead,
  type AppNotification,
  type Farm,
} from "@/lib/api";
import { cn } from "@/lib/utils";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

export function TopBar() {
  const { user } = useUser();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [farmId, setFarmId] = useState<string>("");
  const [showAlerts, setShowAlerts] = useState(false);
  const [alerts, setAlerts] = useState<AppNotification[]>([]);

  useEffect(() => {
    getFarms()
      .then((data) => {
        setFarms(data);
        if (data.length && !farmId) setFarmId(data[0].id);
      })
      .catch(() => {
        setFarms([]);
      });
    getNotifications()
      .then(setAlerts)
      .catch(() => setAlerts([]));
  }, [farmId]);

  const firstName = user?.firstName || user?.username || "Agricultor";
  const selectedFarm = farms.find((f) => f.id === farmId) ?? farms[0];
  const unread = alerts.filter((a) => !a.read).length;

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
    <header className="sticky top-0 z-40 border-b border-forest/8 bg-cream/90 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="text-xs text-ink/45 hidden sm:block">Panel de control</p>
          <h2 className="font-display text-lg sm:text-xl text-forest truncate">
            {greeting()}, {firstName}
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {selectedFarm && (
            <div className="relative hidden md:block">
              <select
                value={farmId}
                onChange={(e) => setFarmId(e.target.value)}
                className="appearance-none rounded-xl border border-forest/12 bg-white pl-3 pr-8 py-2 text-sm text-ink outline-none focus:border-leaf"
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            </div>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAlerts((v) => !v)}
              className="relative grid h-10 w-10 place-items-center rounded-xl border border-forest/10 bg-white hover:bg-mist transition-colors"
              aria-label="Notificaciones"
            >
              <Bell className="h-4 w-4 text-ink/60" />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-red-600 text-[10px] font-bold text-white">
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
                <div className="absolute right-0 top-11 z-50 w-72 rounded-2xl border border-forest/10 bg-white p-3 shadow-xl">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink/45 mb-2">
                    Alertas recientes
                  </p>
                  <ul className="space-y-2 max-h-64 overflow-y-auto">
                    {alerts.length === 0 && (
                      <li className="text-xs text-ink/45 px-2 py-4 text-center">
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
                            a.read ? "bg-mist/40" : "bg-mist/70"
                          )}
                        >
                          <p className="font-medium text-ink">{a.title}</p>
                          {a.body && <p className="text-ink/50 mt-0.5">{a.body}</p>}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>

          <a
            href="https://www.agrocalidad.gob.ec/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:grid h-10 w-10 place-items-center rounded-xl border border-forest/10 bg-white hover:bg-mist"
            aria-label="Ayuda"
          >
            <HelpCircle className="h-4 w-4 text-ink/60" />
          </a>

          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-10 w-10 ring-2 ring-leaf/20",
              },
            }}
          />
        </div>
      </div>

      {selectedFarm && (
        <div className="md:hidden px-4 pb-2">
          <select
            value={farmId}
            onChange={(e) => setFarmId(e.target.value)}
            className={cn(
              "w-full rounded-xl border border-forest/12 bg-white px-3 py-2 text-sm",
              "outline-none focus:border-leaf"
            )}
          >
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </header>
  );
}
