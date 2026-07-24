/** Layout helpers so lots on the same farm don't stack on one point. */

const METERS_PER_DEG_LAT = 111_320;

function metersToDeg(lat: number, eastM: number, northM: number) {
  const metersPerDegLng = Math.max(METERS_PER_DEG_LAT * Math.cos((lat * Math.PI) / 180), 1);
  return {
    dLat: northM / METERS_PER_DEG_LAT,
    dLng: eastM / metersPerDegLng,
  };
}

/** Side length in meters for a square of `areaHa` hectares. */
export function plotSideMeters(areaHa: number) {
  return Math.sqrt(Math.max(Number(areaHa) || 1, 0.1) * 10_000);
}

/**
 * Place lot `index` on a grid around the farm center so sibling lots don't overlap.
 * Gap between centers ≈ 1.2 × side of this lot.
 */
export function offsetPlotCenter(
  farmLat: number,
  farmLng: number,
  index: number,
  areaHa: number
) {
  const side = plotSideMeters(areaHa);
  const gap = side * 1.25;
  const cols = 3;
  const col = index % cols;
  const row = Math.floor(index / cols);
  // Center the 3-column grid on the farm, shift first row slightly north
  const east = (col - 1) * gap;
  const north = gap * 0.65 - row * gap;
  const { dLat, dLng } = metersToDeg(farmLat, east, north);
  return { lat: farmLat + dLat, lng: farmLng + dLng };
}

/** Distinct fill colors so lots are easy to tell apart on the map. */
export const PLOT_PALETTE = [
  "#2D6A4F",
  "#1D4E89",
  "#B08968",
  "#9B2226",
  "#7B2CBF",
  "#0077B6",
  "#CA6702",
  "#40916C",
  "#6A994E",
  "#BC4749",
];

export function plotColor(index: number) {
  return PLOT_PALETTE[index % PLOT_PALETTE.length];
}

export function nearlySamePoint(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
  meters = 40
) {
  const dLat = (a.lat - b.lat) * METERS_PER_DEG_LAT;
  const dLng =
    (a.lng - b.lng) * METERS_PER_DEG_LAT * Math.cos((a.lat * Math.PI) / 180);
  return Math.hypot(dLat, dLng) < meters;
}
