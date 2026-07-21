"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { Menu, Sprout, X } from "lucide-react";
import { useState } from "react";

const LINKS = [
  { href: "#problema", label: "Problema" },
  { href: "#solucion", label: "Solución" },
  { href: "#modulos", label: "Módulos" },
  { href: "#como-funciona", label: "Cómo funciona" },
];

export function LandingNav() {
  const { isSignedIn, isLoaded } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-forest/8 bg-cream/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-leaf/15 ring-1 ring-leaf/25">
            <Sprout className="h-4 w-4 text-leaf" />
          </span>
          <div>
            <p className="font-display text-lg leading-none text-forest">AgroGuardian</p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-ink/45">AI</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-ink/65">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-leaf transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {isLoaded && !isSignedIn && (
            <>
              <Link
                href="/sign-in"
                className="rounded-xl px-4 py-2 text-sm font-medium text-ink/70 hover:text-forest transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/sign-up"
                className="rounded-xl bg-forest px-4 py-2 text-sm font-semibold text-cream hover:bg-leaf-dark transition-colors"
              >
                Registrarse gratis
              </Link>
            </>
          )}
          {isLoaded && isSignedIn && (
            <>
              <Link
                href="/dashboard"
                className="rounded-xl bg-leaf px-4 py-2 text-sm font-semibold text-white hover:bg-leaf-dark transition-colors"
              >
                Ir al panel
              </Link>
              <UserButton />
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden grid h-10 w-10 place-items-center rounded-xl border border-forest/10"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menú"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-forest/8 bg-cream px-4 py-4 space-y-3">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-sm text-ink/70 py-1"
            >
              {l.label}
            </a>
          ))}
          {isLoaded && !isSignedIn && (
            <>
              <Link href="/sign-in" className="block text-sm py-2">
                Iniciar sesión
              </Link>
              <Link
                href="/sign-up"
                className="block rounded-xl bg-forest py-2.5 text-center text-sm font-semibold text-cream"
              >
                Registrarse gratis
              </Link>
            </>
          )}
          {isLoaded && isSignedIn && (
            <Link
              href="/dashboard"
              className="block rounded-xl bg-leaf py-2.5 text-center text-sm font-semibold text-white"
            >
              Ir al panel
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
