"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Leaf,
  ScanLine,
  Stethoscope,
  Map,
  FileText,
  Bot,
  Sprout,
  CloudSun,
  TrendingUp,
  GraduationCap,
  Droplets,
  Home,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Vista General", icon: LayoutDashboard },
  { href: "/cultivos", label: "Mis Cultivos", icon: Leaf },
  { href: "/escanear", label: "Escanear Planta", icon: ScanLine },
  { href: "/diagnosticos", label: "Diagnósticos", icon: Stethoscope },
  { href: "/mapa", label: "Mapa de Fincas", icon: Map },
  { href: "/clima", label: "Clima & Suelo", icon: CloudSun },
  { href: "/clima", label: "Riego Inteligente", icon: Droplets, key: "riego" },
  { href: "/mercados", label: "Mercados & Precios", icon: TrendingUp },
  { href: "/asistente", label: "Asistente IA", icon: Bot },
  { href: "/reportes", label: "Reportes", icon: FileText },
  { href: "/capacitacion", label: "Capacitación", icon: GraduationCap },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const name = user?.fullName || user?.firstName || "Juan Pérez";
  const role = "Productor";

  return (
    <aside className="hidden lg:flex w-[260px] shrink-0 flex-col glass-strong m-3 mr-0 rounded-3xl overflow-hidden">
      <div className="px-5 pt-6 pb-4">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-neon/15 ring-1 ring-neon/40 shadow-[0_0_20px_rgba(182,255,0,0.25)]">
            <Sprout className="h-5 w-5 text-neon" />
          </span>
          <div>
            <p className="text-[13px] font-bold tracking-[0.08em] text-neon uppercase leading-tight">
              Agro Guardian
            </p>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-white/90">AI</p>
            <p className="text-[10px] text-muted mt-0.5">Tu agrónomo inteligente.</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const active =
            item.key !== "riego" &&
            (pathname === item.href || pathname.startsWith(item.href + "/"));
          const Icon = item.icon;
          return (
            <Link
              key={item.key ?? item.href + item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all",
                active
                  ? "bg-neon/15 text-neon neon-border shadow-[0_0_18px_rgba(182,255,0,0.12)]"
                  : "text-white/55 hover:bg-white/5 hover:text-white/90"
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-neon" : "opacity-80")} />
              <span className="flex-1">{item.label}</span>
              {active && (
                <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_8px_#b6ff00]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 space-y-3">
        <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-2.5 ring-1 ring-white/8">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-neon/40 to-mint/30 ring-2 ring-neon/30 grid place-items-center text-xs font-bold text-void">
            {name.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{name}</p>
            <p className="text-[10px] text-muted">{role}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-neon/10 px-3 py-3 ring-1 ring-neon/25">
          <div className="absolute -right-2 -top-2 h-14 w-14 rounded-full border border-neon/30 animate-radar opacity-40" />
          <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-neon animate-pulse-soft" />
          <p className="text-[11px] font-semibold text-neon">Modo IA Activo</p>
          <p className="text-[10px] text-muted mt-0.5">Monitoreo continuo · Manabí</p>
        </div>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const items = [
    { href: "/dashboard", label: "Inicio", icon: Home },
    { href: "/escanear", label: "Escanear", icon: ScanLine },
    { href: "/asistente", label: "Asistente IA", icon: Bot },
    { href: "/diagnosticos", label: "Alertas", icon: Bell },
  ];

  return (
    <nav className="lg:hidden fixed bottom-4 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
      <ul className="pointer-events-auto flex items-center gap-1 rounded-full glass-strong px-2 py-1.5 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-full px-4 py-2 text-[10px] font-medium",
                  active ? "bg-neon/20 text-neon" : "text-white/45"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label.split(" ")[0]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
