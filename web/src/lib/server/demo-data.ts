import type { DiagnosisResult } from "@/types/api";

export const DEMO_FARMS = [
  { id: "f1", name: "Finca La Esperanza", lat: -1.0547, lng: -80.4545, area_ha: 6.5, health_status: "riesgo" as const, status: "riesgo" as const },
  { id: "f2", name: "Lote Río Chico", lat: -1.072, lng: -80.42, area_ha: 3.2, health_status: "sano" as const, status: "sano" as const },
  { id: "f3", name: "Parcela Calceta", lat: -0.845, lng: -80.163, area_ha: 2.1, health_status: "infectado" as const, status: "infectado" as const },
];

export const DEMO_CROPS = [
  { id: "c1", farm_id: "f1", name: "Plátano Barraganete", variety: "Barraganete", growth_stage: "Floración", stage: "Floración", health_pct: 72, health: 72, status: "riesgo" as const, hectares: 3.2 },
  { id: "c2", farm_id: "f1", name: "Cacao Nacional", variety: "Nacional", growth_stage: "Producción", stage: "Producción", health_pct: 91, health: 91, status: "sano" as const, hectares: 2.0 },
  { id: "c3", farm_id: "f2", name: "Maíz duro", variety: "INIAP", growth_stage: "Vegetativo", stage: "Vegetativo", health_pct: 88, health: 88, status: "sano" as const, hectares: 1.5 },
  { id: "c4", farm_id: "f3", name: "Café arábiga", variety: "Arábiga", growth_stage: "Crecimiento", stage: "Crecimiento", health_pct: 64, health: 64, status: "infectado" as const, hectares: 0.8 },
  { id: "c5", farm_id: "f2", name: "Arroz INIAP", variety: "INIAP", growth_stage: "Macollamiento", stage: "Macollamiento", health_pct: 85, health: 85, status: "sano" as const, hectares: 4.1 },
  { id: "c6", farm_id: "f1", name: "Plátano Dominico", variety: "Dominico", growth_stage: "Desarrollo", stage: "Desarrollo", health_pct: 79, health: 79, status: "riesgo" as const, hectares: 1.2 },
];

const g = globalThis as unknown as {
  agroCases?: Map<string, DiagnosisResult>;
  agroFarms?: typeof DEMO_FARMS;
  agroCrops?: typeof DEMO_CROPS;
  agroPlots?: {
    id: string;
    farm_id: string;
    name: string;
    area_ha: number;
    lat: number | null;
    lng: number | null;
    health_status: string;
  }[];
};

export function getFarmStore() {
  if (!g.agroFarms) g.agroFarms = [...DEMO_FARMS];
  return g.agroFarms;
}

export function getCropStore() {
  if (!g.agroCrops) g.agroCrops = [...DEMO_CROPS];
  return g.agroCrops;
}

export function getPlotStore() {
  if (!g.agroPlots) g.agroPlots = [];
  return g.agroPlots;
}

export function demoDashboard() {
  const crops = DEMO_CROPS;
  const infected = crops.filter((c) => c.status !== "sano").length;
  const avg = Math.round(crops.reduce((a, c) => a + (c.health_pct ?? c.health), 0) / crops.length);
  const sano = crops.filter((c) => c.status === "sano").length;
  const riesgo = crops.filter((c) => c.status === "riesgo").length;
  const infect = crops.filter((c) => c.status === "infectado").length;
  const total = crops.length;
  return {
    active_crops: total,
    detected_cases: infected,
    climate_risk: "alto",
    avg_health: avg,
    crop_status: {
      healthy: Math.round((sano / total) * 100),
      risk: Math.round((riesgo / total) * 100),
      infected: Math.round((infect / total) * 100),
    },
  };
}

export function getCaseStore() {
  if (!g.agroCases) g.agroCases = new Map();
  return g.agroCases;
}

export const MARKET_PRICES = [
  { crop: "Plátano", price_usd: 0.42, unit: "kg", trend: "up" as const, market: "Portoviejo" },
  { crop: "Cacao", price_usd: 3.15, unit: "kg", trend: "stable" as const, market: "Manta" },
  { crop: "Maíz", price_usd: 0.38, unit: "kg", trend: "down" as const, market: "Chone" },
  { crop: "Café", price_usd: 4.8, unit: "kg", trend: "up" as const, market: "Jipijapa" },
  { crop: "Arroz", price_usd: 0.55, unit: "kg", trend: "stable" as const, market: "Portoviejo" },
];

export function isDbMissingError(err: unknown) {
  const msg = String(err instanceof Error ? err.message : err);
  return msg.includes("PGRST205") || msg.includes("Could not find the table");
}
