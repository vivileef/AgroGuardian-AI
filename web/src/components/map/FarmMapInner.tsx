"use client";

import { Fragment, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polygon,
  Tooltip,
  useMap,
} from "react-leaflet";
import type { LatLngBoundsExpression, LatLngExpression, LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

export type MapPin = {
  id: string;
  name: string;
  label?: string;
  lat: number;
  lng: number;
  status: "sano" | "riesgo" | "infectado";
  area_ha?: number;
  kind?: "farm" | "plot";
  color?: string;
  farm_name?: string;
};

const STATUS_COLORS = {
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

  const visible = useMemo(() => {
    if (!selectedId) return farms;
    return farms.filter((f) => f.id === selectedId);
  }, [farms, selectedId]);

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
        key={`map-${selectedId ?? "none"}-${visible.length}`}
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

        {visible.map((f) => {
          const isSelected = f.id === selectedId;
          const ha = Number(f.area_ha) > 0 ? Number(f.area_ha) : f.kind === "plot" ? 1 : 0;
          const fill = f.color ?? STATUS_COLORS[f.status] ?? "#2D6A4F";
          const showArea = ha > 0 && (f.kind === "plot" || isSelected || !selectedId);

          return (
            <Fragment key={f.id}>
              {showArea && (
                <Polygon
                  positions={areaPolygon(f.lat, f.lng, ha)}
                  pathOptions={{
                    color: isSelected || selectedId ? "#081c15" : fill,
                    weight: isSelected || selectedId ? 4 : f.kind === "plot" ? 2.5 : 2,
                    fillColor: fill,
                    fillOpacity: isSelected || selectedId ? 0.45 : f.kind === "plot" ? 0.28 : 0.18,
                  }}
                >
                  <Tooltip
                    permanent={f.kind === "plot" || Boolean(selectedId)}
                    direction="center"
                    opacity={0.95}
                    className="ag-plot-label"
                  >
                    <span style={{ fontWeight: 600, fontSize: 11 }}>
                      {f.kind === "plot" ? f.name : f.label ?? f.name}
                      {ha > 0 ? ` · ${ha} ha` : ""}
                    </span>
                  </Tooltip>
                  <Popup>
                    <strong>{f.label ?? f.name}</strong>
                    <br />
                    {f.farm_name ? (
                      <>
                        Finca: {f.farm_name}
                        <br />
                      </>
                    ) : null}
                    {ha > 0 ? (
                      <>
                        Área: {ha} ha
                        <br />
                      </>
                    ) : null}
                    Estado: {f.status}
                  </Popup>
                </Polygon>
              )}
              <CircleMarker
                center={[f.lat, f.lng]}
                radius={isSelected || selectedId ? 14 : f.kind === "plot" ? 8 : 10}
                pathOptions={{
                  color: isSelected || selectedId ? "#081c15" : fill,
                  fillColor: fill,
                  fillOpacity: 1,
                  weight: 3,
                }}
              />
            </Fragment>
          );
        })}
      </MapContainer>
      <style>{`
        .leaflet-tooltip.ag-plot-label {
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(27, 67, 50, 0.25);
          border-radius: 6px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
          padding: 2px 6px;
          color: #1b4332;
          white-space: nowrap;
        }
        .leaflet-tooltip.ag-plot-label::before {
          display: none;
        }
      `}</style>
    </div>
  );
}
