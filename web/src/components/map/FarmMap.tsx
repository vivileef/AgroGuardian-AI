"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getFarms, type Farm } from "@/lib/api";
import type { MapPin } from "./FarmMapInner";

const MapInner = dynamic(() => import("./FarmMapInner"), {
  ssr: false,
  loading: () => (
    <div className="grid h-72 place-items-center rounded-2xl bg-forest/5 text-sm text-ink/50">
      Cargando mapa…
    </div>
  ),
});

export type MapFarm = MapPin;

export function FarmMap({
  height = 320,
  farms: farmsProp,
  selectedId = null,
}: {
  height?: number;
  farms?: MapFarm[];
  selectedId?: string | null;
}) {
  const [fetched, setFetched] = useState<MapFarm[]>([]);

  useEffect(() => {
    if (farmsProp) return;
    let cancelled = false;
    getFarms()
      .then((list: Farm[]) => {
        if (cancelled) return;
        setFetched(
          list.map((f) => ({
            id: f.id,
            name: f.name,
            lat: f.lat,
            lng: f.lng,
            status: f.health_status,
            area_ha: f.area_ha,
            kind: "farm" as const,
          }))
        );
      })
      .catch(() => {
        if (!cancelled) setFetched([]);
      });
    return () => {
      cancelled = true;
    };
  }, [farmsProp]);

  return (
    <MapInner
      farms={farmsProp ?? fetched}
      height={height}
      selectedId={selectedId}
    />
  );
}
