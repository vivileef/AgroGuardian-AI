"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Minus, TrendingUp } from "lucide-react";
import { getMarketPrices, type MarketPrice } from "@/lib/api";
import { cn } from "@/lib/utils";

const trendIcon = {
  up: ArrowUp,
  down: ArrowDown,
  stable: Minus,
};

const trendStyle = {
  up: "text-emerald-700 bg-emerald-50",
  down: "text-red-700 bg-red-50",
  stable: "text-ink/60 bg-mist",
};

export default function MercadosPage() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);

  useEffect(() => {
    getMarketPrices()
      .then(setPrices)
      .catch(() => null);
  }, []);

  return (
    <div className="space-y-6 animate-fade-up">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-leaf">Comercialización</p>
        <h1 className="font-display text-3xl text-forest mt-1">Mercados y precios</h1>
        <p className="text-sm text-ink/60 mt-1">
          Precios de referencia en mercados de Manabí y tendencias de la semana.
        </p>
      </header>

      <div className="rounded-2xl border border-forest/10 bg-cream overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-forest text-cream text-left text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-medium">Cultivo</th>
                <th className="px-4 py-3 font-medium">Precio (USD)</th>
                <th className="px-4 py-3 font-medium">Unidad</th>
                <th className="px-4 py-3 font-medium">Mercado</th>
                <th className="px-4 py-3 font-medium">Tendencia</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((p) => {
                const Icon = trendIcon[p.trend];
                return (
                  <tr key={p.crop} className="border-t border-forest/8">
                    <td className="px-4 py-3 font-medium text-forest">{p.crop}</td>
                    <td className="px-4 py-3 font-display text-lg">${p.price_usd.toFixed(2)}</td>
                    <td className="px-4 py-3 text-ink/60">{p.unit}</td>
                    <td className="px-4 py-3 text-ink/60">{p.market}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium capitalize",
                          trendStyle[p.trend]
                        )}
                      >
                        <Icon className="h-3 w-3" />
                        {p.trend === "up" ? "Sube" : p.trend === "down" ? "Baja" : "Estable"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-forest/10 bg-cream p-5">
          <TrendingUp className="h-8 w-8 text-leaf mb-3" />
          <h2 className="font-display text-lg text-forest">Conectar con compradores</h2>
          <p className="text-sm text-ink/60 mt-2">
            Próximamente: marketplace para vender cosecha directamente a cooperativas y exportadores
            certificados en Manta y Guayaquil.
          </p>
        </div>
        <div className="rounded-2xl border border-forest/10 bg-cream p-5 text-sm text-ink/60">
          <p>
            Fuentes de datos: MAG Ecuador, mercados mayoristas de Portoviejo y referencias FAOSTAT.
            Actualizado: {prices[0]?.updated ?? "—"}.
          </p>
        </div>
      </div>
    </div>
  );
}
