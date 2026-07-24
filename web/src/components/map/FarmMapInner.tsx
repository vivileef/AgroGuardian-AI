"use client";

import { Fragment, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polygon,
  useMap,
} from "react-leaflet";
import type { LatLngBoundsExpression, LatLngExpression, LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

export type MapPin = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: "sano" | "riesgo" | "infectado";
  area_ha?: number;
  kind?: "farm" | "plot";
};

const COLORS = {
  sano: "#2D6A4F",
  riesgo: "#D4A017",
  infectado: "#C1121F",
};

/** Square ring around center sized by hectares (1 ha ≈ 100×100 m). */
export function areaPolygon(
  lat: number,
  lng: number,
  areaHa: number
): LatLngTuple[] {
  const sideM = Math.sqrt(Math.max(Number(areaHa) || 1, 0.1) * 10_000);
  const half = sideM / 2;
  const metersPerDegLat = 111_320;
  const metersPerDegLng = Math.max(111_320 * Math.cos((lat * Math.PI) / 180), 1);
  const dLat = half / metersPerDegLat;
  const dLng = half / metersPerDegLng;
  return [
    [lat - dLat, lng - dLng],
    [lat - dLat, lng + dLng],
    [lat + dLat, lng + dLng],
    [lat + dLat, lng - dLng],
  ];
}

function FocusSelected({
  selected,
  positions,
}: {
  selected: MapPin | null;
  positions: LatLngTuple[] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selected || !positions?.length) return;
    map.fitBounds(positions as LatLngBoundsExpression, {
      padding: [56, 56],
      maxZoom: 17,
      animate: true,
    });
  }, [map, selected, positions]);

  return null;
}

export default function FarmMapInner({
  farms,
  height,
  selectedId = null,
}: {
  farms: MapPin[];
  height: number;
  selectedId?: string | null;
}) {
  const selected = useMemo(
    () => farms.find((f) => f.id === selectedId) ?? null,
    [farms, selectedId]
  );

  const selectedPoly = useMemo(() => {
    if (!selected) return null;
    const ha = Number(selected.area_ha) > 0 ? Number(selected.area_ha) : 1;
    return areaPolygon(selected.lat, selected.lng, ha);
  }, [selected]);

  const center: LatLngExpression = selected
    ? [selected.lat, selected.lng]
    : farms[0]
      ? [farms[0].lat, farms[0].lng]
      : [-1.05, -80.45];

  return (
    <div className="overflow-hidden rounded-2xl border border-forest/10" style={{ height }}>
      <MapContainer
        key={`map-${selectedId ?? "none"}-${farms.length}`}
        center={center}
        zoom={selected ? 15 : 11}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FocusSelected selected={selected} positions={selectedPoly} />

        {/* Selected lot/farm area as a clear filled square */}
        {selected && selectedPoly && (
          <Polygon
            positions={selectedPoly}
            pathOptions={{
              color: "#1B4332",
              weight: 4,
              fillColor: COLORS[selected.status] ?? "#2D6A4F",
              fillOpacity: 0.35,
            }}
          >
            <Popup>
              <strong>{selected.name}</strong>
              <br />
              Área aproximada: {Number(selected.area_ha) > 0 ? selected.area_ha : 1} ha
              <br />
              Estado: {selected.status}
            </Popup>
          </Polygon>
        )}

        {farms.map((f) => {
          const isSelected = f.id === selectedId;
          const color = COLORS[f.status] ?? "#2D6A4F";
          const ha = Number(f.area_ha) > 0 ? Number(f.area_ha) : f.kind === "plot" ? 1 : 0;

          return (
            <Fragment key={f.id}>
              {/* Light outline for other plots so areas are visible even without selection */}
              {!isSelected && f.kind === "plot" && ha > 0 && (
                <Polygon
                  positions={areaPolygon(f.lat, f.lng, ha)}
                  pathOptions={{
                    color,
                    weight: 1.5,
                    fillColor: color,
                    fillOpacity: 0.12,
                    dashArray: "4 4",
                  }}
                />
              )}
              <CircleMarker
                center={[f.lat, f.lng]}
                radius={isSelected ? 16 : 10}
                pathOptions={{
                  color: isSelected ? "#081c15" : color,
                  fillColor: color,
                  fillOpacity: isSelected ? 1 : 0.75,
                  weight: isSelected ? 3 : 2,
                }}
              >
                <Popup>
                  <strong>{f.name}</strong>
                  <br />
                  {ha > 0 ? (
                    <>
                      Área: {ha} ha
                      <br />
                    </>
                  ) : null}
                  Estado: {f.status}
                </Popup>
              </CircleMarker>
            </Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}
