import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { AppConfig, hasSupabase } from "./config";
import type {
  DiagnosisResult,
  OnboardingPayload,
  Recommendation,
  WeatherSnapshot,
  FollowUpPlan,
  AgentTrace,
  RiskLevel,
} from "@/types/api";

export function getAdminClient(cfg: AppConfig): SupabaseClient | null {
  if (!hasSupabase(cfg)) return null;
  return createClient(cfg.supabaseUrl, cfg.supabaseServiceKey);
}

export async function upsertProfile(
  client: SupabaseClient,
  userId: string,
  fullName?: string
) {
  const payload: Record<string, string> = { id: userId };
  if (fullName) payload.full_name = fullName;
  await client.from("profiles").upsert(payload);
}

const CROP_TEMPLATES: Record<
  string,
  { variety: string; stage: string; health: number; status: "sano" | "riesgo" | "infectado" }
> = {
  Plátano: { variety: "Barraganete", stage: "Floración", health: 72, status: "riesgo" },
  Cacao: { variety: "Nacional", stage: "Producción", health: 91, status: "sano" },
  Maíz: { variety: "INIAP", stage: "Vegetativo", health: 88, status: "sano" },
  Café: { variety: "Arábiga", stage: "Crecimiento", health: 64, status: "infectado" },
  Arroz: { variety: "INIAP", stage: "Macollamiento", health: 85, status: "sano" },
};

export async function createFarmFromOnboarding(
  client: SupabaseClient,
  userId: string,
  data: OnboardingPayload
) {
  await upsertProfile(client, userId, data.fullName);

  const { data: farm, error: farmErr } = await client
    .from("farms")
    .insert({
      owner_id: userId,
      name: data.farmName,
      lat: -1.0547,
      lng: -80.4545,
      area_ha: data.hectares,
      health_status: "riesgo",
    })
    .select("id")
    .single();

  if (farmErr || !farm) throw farmErr ?? new Error("No se pudo crear la finca");

  const crops = data.crops.map((name) => {
    const t = CROP_TEMPLATES[name] ?? {
      variety: "Local",
      stage: "Desarrollo",
      health: 80,
      status: "sano" as const,
    };
    return {
      farm_id: farm.id,
      name: name === "Plátano" ? "Plátano Barraganete" : `${name} ${t.variety}`.trim(),
      variety: t.variety,
      growth_stage: t.stage,
      health_pct: t.health,
      status: t.status,
    };
  });

  if (crops.length) {
    await client.from("crops").insert(crops);
  }

  await client.from("notifications").insert({
    owner_id: userId,
    title: "¡Bienvenido a AgroGuardian!",
    body: `Tu finca «${data.farmName}» está lista para monitorear.`,
    severity: "info",
  });

  return farm.id as string;
}

export async function userHasFarm(client: SupabaseClient, userId: string) {
  const { data } = await client
    .from("farms")
    .select("id")
    .eq("owner_id", userId)
    .limit(1);
  return (data?.length ?? 0) > 0;
}

export type FarmRow = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  area_ha: number;
  health_status: "sano" | "riesgo" | "infectado";
  owner_id?: string;
  created_at?: string;
  status: "sano" | "riesgo" | "infectado";
};

export async function listFarms(client: SupabaseClient, userId: string): Promise<FarmRow[]> {
  const { data, error } = await client
    .from("farms")
    .select("id,name,lat,lng,area_ha,health_status,owner_id,created_at")
    .eq("owner_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => {
    const status = (row.health_status as FarmRow["health_status"]) ?? "sano";
    return {
      id: row.id as string,
      name: row.name as string,
      lat: Number(row.lat ?? -1.0547),
      lng: Number(row.lng ?? -80.4545),
      area_ha: Number(row.area_ha ?? 1),
      health_status: status,
      status,
      owner_id: row.owner_id as string | undefined,
      created_at: row.created_at as string | undefined,
    };
  });
}

export async function createFarm(
  client: SupabaseClient,
  userId: string,
  input: { name: string; lat?: number; lng?: number; area_ha?: number }
) {
  await upsertProfile(client, userId);
  const { data, error } = await client
    .from("farms")
    .insert({
      owner_id: userId,
      name: input.name,
      lat: input.lat ?? -1.0547,
      lng: input.lng ?? -80.4545,
      area_ha: input.area_ha ?? 1,
      health_status: "sano",
    })
    .select("id,name,lat,lng,area_ha,health_status,owner_id,created_at")
    .single();
  if (error || !data) throw error ?? new Error("No se pudo crear la finca");
  const status = (data.health_status as FarmRow["health_status"]) ?? "sano";
  return {
    id: data.id as string,
    name: data.name as string,
    lat: Number(data.lat ?? -1.0547),
    lng: Number(data.lng ?? -80.4545),
    area_ha: Number(data.area_ha ?? 1),
    health_status: status,
    status,
    owner_id: data.owner_id as string,
    created_at: data.created_at as string,
  };
}

export type CropRow = {
  id: string;
  farm_id: string;
  name: string;
  variety: string;
  growth_stage: string;
  stage: string;
  health_pct: number;
  health: number;
  status: "sano" | "riesgo" | "infectado";
  hectares: number;
  plot_id?: string | null;
};

export async function listCrops(client: SupabaseClient, userId: string): Promise<CropRow[]> {
  const farms = await listFarms(client, userId);
  const farmIds = farms.map((f) => f.id);
  if (!farmIds.length) return [];

  const { data, error } = await client
    .from("crops")
    .select("id,farm_id,plot_id,name,variety,growth_stage,health_pct,status")
    .in("farm_id", farmIds)
    .order("created_at", { ascending: true });
  if (error) throw error;

  return (data ?? []).map((row) => {
    const health = (row.health_pct as number) ?? 80;
    const stage = (row.growth_stage as string) ?? "—";
    return {
      id: row.id as string,
      farm_id: row.farm_id as string,
      plot_id: (row.plot_id as string | null) ?? null,
      name: row.name as string,
      variety: (row.variety as string) ?? "",
      growth_stage: stage,
      stage,
      health_pct: health,
      health,
      status: (row.status as CropRow["status"]) ?? "sano",
      hectares: 1.0,
    };
  });
}

export async function createCrop(
  client: SupabaseClient,
  userId: string,
  input: {
    farm_id: string;
    name: string;
    variety?: string;
    growth_stage?: string;
    hectares?: number;
    plot_id?: string | null;
  }
) {
  const farms = await listFarms(client, userId);
  if (!farms.some((f) => f.id === input.farm_id)) {
    throw new Error("La finca no pertenece al usuario");
  }

  const stage = input.growth_stage ?? "Desarrollo";
  const { data, error } = await client
    .from("crops")
    .insert({
      farm_id: input.farm_id,
      plot_id: input.plot_id ?? null,
      name: input.name,
      variety: input.variety ?? "",
      growth_stage: stage,
      health_pct: 90,
      status: "sano",
    })
    .select("id,farm_id,plot_id,name,variety,growth_stage,health_pct,status")
    .single();
  if (error || !data) throw error ?? new Error("No se pudo crear el cultivo");

  return {
    id: data.id as string,
    farm_id: data.farm_id as string,
    plot_id: (data.plot_id as string | null) ?? null,
    name: data.name as string,
    variety: (data.variety as string) ?? "",
    growth_stage: stage,
    stage,
    health_pct: (data.health_pct as number) ?? 90,
    health: (data.health_pct as number) ?? 90,
    status: (data.status as CropRow["status"]) ?? "sano",
    hectares: input.hectares ?? 1,
  };
}

export type PlotRow = {
  id: string;
  farm_id: string;
  name: string;
  area_ha: number;
  lat?: number | null;
  lng?: number | null;
  health_status: string;
};

export async function listPlots(client: SupabaseClient, userId: string): Promise<PlotRow[]> {
  const farms = await listFarms(client, userId);
  const farmIds = farms.map((f) => f.id);
  if (!farmIds.length) return [];

  const { data, error } = await client
    .from("plots")
    .select("id,farm_id,name,area_ha,lat,lng,health_status")
    .in("farm_id", farmIds);
  if (error) {
    // columns lat/lng/health_status may be missing pre-migration
    const fallback = await client
      .from("plots")
      .select("id,farm_id,name,area_ha")
      .in("farm_id", farmIds);
    if (fallback.error) throw fallback.error;
    return (fallback.data ?? []).map((row) => ({
      id: row.id as string,
      farm_id: row.farm_id as string,
      name: row.name as string,
      area_ha: Number(row.area_ha ?? 1),
      lat: null,
      lng: null,
      health_status: "sano",
    }));
  }
  return (data ?? []).map((row) => ({
    id: row.id as string,
    farm_id: row.farm_id as string,
    name: row.name as string,
    area_ha: Number(row.area_ha ?? 1),
    lat: row.lat as number | null,
    lng: row.lng as number | null,
    health_status: (row.health_status as string) ?? "sano",
  }));
}

export async function createPlot(
  client: SupabaseClient,
  userId: string,
  input: {
    farm_id: string;
    name: string;
    area_ha?: number;
    lat?: number;
    lng?: number;
  }
) {
  const farms = await listFarms(client, userId);
  const farm = farms.find((f) => f.id === input.farm_id);
  if (!farm) throw new Error("La finca no pertenece al usuario");

  const lat = input.lat ?? farm.lat;
  const lng = input.lng ?? farm.lng;

  const basePayload = {
    farm_id: input.farm_id,
    name: input.name,
    area_ha: input.area_ha ?? 1,
  };

  const withCoords = {
    ...basePayload,
    lat,
    lng,
    health_status: "sano",
  };

  let { data, error } = await client.from("plots").insert(withCoords).select("*").single();

  // DB may not have migration 003 columns yet (lat/lng/health_status)
  if (error && isMissingColumnError(error)) {
    const retry = await client.from("plots").insert(basePayload).select("*").single();
    data = retry.data;
    error = retry.error;
  }

  if (error || !data) {
    throw new Error(formatDbError(error) || "No se pudo crear la parcela");
  }

  return {
    id: data.id as string,
    farm_id: data.farm_id as string,
    name: data.name as string,
    area_ha: Number(data.area_ha ?? 1),
    lat: (data.lat as number | null) ?? lat ?? null,
    lng: (data.lng as number | null) ?? lng ?? null,
    health_status: (data.health_status as string) ?? "sano",
  };
}

function isMissingColumnError(error: unknown) {
  const msg = String(
    (error as { message?: string })?.message ??
      (error as { details?: string })?.details ??
      error ??
      ""
  ).toLowerCase();
  return (
    msg.includes("column") ||
    msg.includes("lat") ||
    msg.includes("lng") ||
    msg.includes("health_status") ||
    msg.includes("schema cache") ||
    (error as { code?: string })?.code === "PGRST204"
  );
}

function formatDbError(error: unknown) {
  if (!error) return null;
  if (error instanceof Error) return error.message;
  const e = error as { message?: string; details?: string; hint?: string; code?: string };
  return [e.message, e.details, e.hint].filter(Boolean).join(" — ") || e.code || null;
}

export async function dashboardStats(client: SupabaseClient, userId: string) {
  const crops = await listCrops(client, userId);
  const { data: detections } = await client
    .from("detections")
    .select("id")
    .eq("owner_id", userId);

  const infected = crops.filter((c) => c.status !== "sano").length;
  const avg = crops.length
    ? Math.round(crops.reduce((a, c) => a + c.health, 0) / crops.length)
    : 0;
  const sano = crops.filter((c) => c.status === "sano").length;
  const riesgo = crops.filter((c) => c.status === "riesgo").length;
  const infect = crops.filter((c) => c.status === "infectado").length;
  const total = crops.length || 1;

  return {
    active_crops: crops.length,
    detected_cases: detections?.length ?? Math.max(infected, 0),
    climate_risk: "alto",
    avg_health: avg,
    crop_status: {
      healthy: Math.round((sano / total) * 100),
      risk: Math.round((riesgo / total) * 100),
      infected: Math.round((infect / total) * 100),
    },
  };
}

type StoredPayload = {
  version: 2;
  traces: AgentTrace[];
  diagnosis: string;
  weather: WeatherSnapshot;
  follow_up: FollowUpPlan;
  demo: boolean;
};

function packTrace(result: DiagnosisResult): StoredPayload {
  return {
    version: 2,
    traces: result.agent_trace,
    diagnosis: result.diagnosis,
    weather: result.weather,
    follow_up: result.follow_up,
    demo: result.demo,
  };
}

function unpackTrace(raw: unknown): Partial<StoredPayload> & { traces: AgentTrace[] } {
  if (Array.isArray(raw)) {
    return { traces: raw as AgentTrace[] };
  }
  if (raw && typeof raw === "object" && "version" in (raw as object)) {
    const p = raw as StoredPayload;
    return {
      version: 2,
      traces: p.traces ?? [],
      diagnosis: p.diagnosis,
      weather: p.weather,
      follow_up: p.follow_up,
      demo: p.demo,
    };
  }
  return { traces: [] };
}

export async function saveDetection(
  client: SupabaseClient,
  userId: string,
  result: DiagnosisResult,
  opts?: { crop_id?: string | null; farm_id?: string | null }
) {
  const det = result.detection;
  const packed = packTrace(result);

  // Prefer expanded columns (migration 003); fall back to agent_trace payload.
  let detectionId = result.id;
  const baseRow: Record<string, unknown> = {
    id: result.id,
    owner_id: userId,
    disease: det.disease,
    confidence: det.confidence,
    risk_level: det.risk_level,
    affected_part: det.affected_part,
    rationale: det.rationale,
    agent_trace: packed,
    crop_id: opts?.crop_id ?? result.crop_id ?? null,
    farm_id: opts?.farm_id ?? result.farm_id ?? null,
    diagnosis: result.diagnosis,
    weather: result.weather,
    follow_up: result.follow_up,
    created_at: result.created_at,
  };

  let { data: ins, error } = await client
    .from("detections")
    .upsert(baseRow)
    .select("id")
    .single();

  if (error) {
    const slim = {
      id: result.id,
      owner_id: userId,
      disease: det.disease,
      confidence: det.confidence,
      risk_level: det.risk_level,
      affected_part: det.affected_part,
      rationale: det.rationale,
      agent_trace: packed,
      crop_id: opts?.crop_id ?? result.crop_id ?? null,
      created_at: result.created_at,
    };
    const retry = await client.from("detections").upsert(slim).select("id").single();
    if (retry.error) throw retry.error;
    ins = retry.data;
  }

  detectionId = (ins?.id as string) ?? result.id;

  if (result.recommendations.length) {
    await client.from("recommendations").delete().eq("detection_id", detectionId);
    await client.from("recommendations").insert(
      result.recommendations.map((r, i) => ({
        detection_id: detectionId,
        title: r.title,
        detail: r.detail,
        priority: r.priority ?? i + 1,
        timeframe: r.timeframe,
        completed: false,
      }))
    );
  }

  // Update crop health from risk
  const cropId = opts?.crop_id ?? result.crop_id;
  if (cropId) {
    const status =
      det.risk_level === "critico" || det.risk_level === "alto"
        ? "infectado"
        : det.risk_level === "medio"
          ? "riesgo"
          : "sano";
    const health =
      status === "infectado" ? 55 : status === "riesgo" ? 72 : 90;
    await client.from("crops").update({ status, health_pct: health }).eq("id", cropId);
  }

  // Notify on high risk
  if (det.risk_level === "alto" || det.risk_level === "critico") {
    await client.from("notifications").insert({
      owner_id: userId,
      title: `Alerta: ${det.disease}`,
      body: `${det.crop} · riesgo ${det.risk_level}. Revisa el diagnóstico y aplica el plan.`,
      severity: det.risk_level === "critico" ? "critical" : "warning",
    });
  }

  return detectionId;
}

export async function listDetections(
  client: SupabaseClient,
  userId: string
): Promise<DiagnosisResult[]> {
  const { data, error } = await client
    .from("detections")
    .select(
      "id,disease,confidence,risk_level,affected_part,rationale,agent_trace,diagnosis,weather,follow_up,crop_id,farm_id,created_at,crops(name)"
    )
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    const fallback = await client
      .from("detections")
      .select(
        "id,disease,confidence,risk_level,affected_part,rationale,agent_trace,crop_id,created_at,crops(name)"
      )
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });
    if (fallback.error) throw fallback.error;
    return Promise.all(
      (fallback.data ?? []).map((row) => hydrateDetection(client, row as Record<string, unknown>))
    );
  }
  return Promise.all((data ?? []).map((row) => hydrateDetection(client, row as Record<string, unknown>)));
}

export async function getDetection(
  client: SupabaseClient,
  userId: string,
  id: string
): Promise<DiagnosisResult | null> {
  const { data, error } = await client
    .from("detections")
    .select("*")
    .eq("owner_id", userId)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) {
    const fallback = await client
      .from("detections")
      .select("id,disease,confidence,risk_level,affected_part,rationale,agent_trace,crop_id,created_at")
      .eq("owner_id", userId)
      .eq("id", id)
      .maybeSingle();
    if (fallback.error || !fallback.data) return null;
    return hydrateDetection(client, fallback.data as Record<string, unknown>);
  }
  return hydrateDetection(client, data as Record<string, unknown>);
}

async function hydrateDetection(
  client: SupabaseClient,
  row: Record<string, unknown>
): Promise<DiagnosisResult> {
  const packed = unpackTrace(row.agent_trace);
  const { data: recs } = await client
    .from("recommendations")
    .select("id,title,detail,priority,timeframe,completed")
    .eq("detection_id", row.id as string)
    .order("priority", { ascending: true });

  const cropJoin = row.crops as { name?: string } | null | undefined;
  const cropName =
    cropJoin?.name ||
    packed.weather?.location ||
    "Cultivo";

  const recommendations: (Recommendation & { id?: string; completed?: boolean })[] = (
    recs ?? []
  ).map((r) => ({
    id: r.id as string,
    title: r.title as string,
    detail: r.detail as string,
    priority: (r.priority as number) ?? 1,
    timeframe: (r.timeframe as string) ?? "",
    completed: Boolean(r.completed),
  }));

  const weather =
    (row.weather as WeatherSnapshot | undefined) ??
    packed.weather ?? {
      temperature_c: 0,
      humidity_pct: 0,
      rain_mm: 0,
      wind_kmh: 0,
      condition: "—",
      climate_risk: "medio" as RiskLevel,
      source: "stored",
      location: "Manabí",
    };

  return {
    id: row.id as string,
    created_at: (row.created_at as string) ?? new Date().toISOString(),
    detection: {
      disease: row.disease as string,
      crop: cropName,
      confidence: Number(row.confidence ?? 0),
      affected_part: (row.affected_part as string) ?? "hoja",
      risk_level: (row.risk_level as RiskLevel) ?? "medio",
      rationale: (row.rationale as string) ?? "",
    },
    weather,
    diagnosis: (row.diagnosis as string) ?? packed.diagnosis ?? (row.rationale as string) ?? "",
    recommendations,
    follow_up: (row.follow_up as FollowUpPlan) ??
      packed.follow_up ?? { check_in_hours: 72, steps: [] },
    agent_trace: packed.traces,
    demo: packed.demo ?? false,
    crop_id: (row.crop_id as string | null) ?? null,
    farm_id: (row.farm_id as string | null) ?? null,
  };
}

export async function setRecommendationCompleted(
  client: SupabaseClient,
  userId: string,
  recommendationId: string,
  completed: boolean
) {
  const { data: rec, error } = await client
    .from("recommendations")
    .select("id,detection_id")
    .eq("id", recommendationId)
    .maybeSingle();
  if (error || !rec) throw error ?? new Error("Recomendación no encontrada");

  const { data: det, error: detErr } = await client
    .from("detections")
    .select("owner_id")
    .eq("id", rec.detection_id)
    .maybeSingle();
  if (detErr || !det || det.owner_id !== userId) throw new Error("No autorizado");

  const { error: upErr } = await client
    .from("recommendations")
    .update({ completed })
    .eq("id", recommendationId);
  if (upErr) throw upErr;
}

export async function listNotifications(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from("notifications")
    .select("id,title,body,severity,read,created_at")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) throw error;
  return data ?? [];
}

export async function markNotificationRead(
  client: SupabaseClient,
  userId: string,
  id: string
) {
  await client
    .from("notifications")
    .update({ read: true })
    .eq("id", id)
    .eq("owner_id", userId);
}

export async function createClimateAlert(
  client: SupabaseClient,
  userId: string,
  weather: WeatherSnapshot
) {
  if (weather.climate_risk !== "alto" && weather.climate_risk !== "critico") return;
  const title =
    weather.climate_risk === "critico"
      ? "Riesgo climático crítico"
      : "Alerta climática para tu finca";
  const body = `${weather.condition} · humedad ${weather.humidity_pct}% · lluvia ${weather.rain_mm} mm. Evalúa si puedes aplicar tratamientos hoy.`;

  const since = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
  const { data: recent } = await client
    .from("notifications")
    .select("id")
    .eq("owner_id", userId)
    .eq("title", title)
    .gte("created_at", since)
    .limit(1);
  if (recent?.length) return;

  await client.from("notifications").insert({
    owner_id: userId,
    title,
    body,
    severity: weather.climate_risk === "critico" ? "critical" : "warning",
  });
}

export async function listLessons(client: SupabaseClient, diseaseHint?: string) {
  const { data, error } = await client
    .from("lessons")
    .select("id,slug,title,crop,disease_keywords,duration_min,content_md")
    .order("title");
  if (error) return [];
  const rows = data ?? [];
  if (!diseaseHint) return rows;
  const q = diseaseHint.toLowerCase();
  const matched = rows.filter((l) => {
    const keys = (l.disease_keywords as string[]) ?? [];
    return keys.some((k) => q.includes(k.toLowerCase()) || k.toLowerCase().includes(q));
  });
  return matched.length ? matched : rows;
}

export async function listMarketPrices(client: SupabaseClient) {
  const { data, error } = await client
    .from("market_prices")
    .select("crop,price_usd,unit,trend,market,updated_at")
    .order("crop");
  if (error || !data?.length) return null;
  return data.map((r) => ({
    crop: r.crop as string,
    price_usd: Number(r.price_usd),
    unit: (r.unit as string) ?? "kg",
    trend: (r.trend as "up" | "down" | "stable") ?? "stable",
    market: r.market as string,
    updated: (r.updated_at as string)?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  }));
}

export async function periodReportSummary(client: SupabaseClient, userId: string, days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const { data: detections } = await client
    .from("detections")
    .select("id,disease,risk_level,created_at,rationale")
    .eq("owner_id", userId)
    .gte("created_at", since)
    .order("created_at", { ascending: false });

  const ids = (detections ?? []).map((d) => d.id as string);
  let completed = 0;
  let pending = 0;
  if (ids.length) {
    const { data: recs } = await client
      .from("recommendations")
      .select("completed,detection_id")
      .in("detection_id", ids);
    for (const r of recs ?? []) {
      if (r.completed) completed += 1;
      else pending += 1;
    }
  }

  const byDisease: Record<string, number> = {};
  for (const d of detections ?? []) {
    const key = d.disease as string;
    byDisease[key] = (byDisease[key] ?? 0) + 1;
  }

  return {
    period_days: days,
    scans: detections?.length ?? 0,
    treatments_done: completed,
    treatments_pending: pending,
    by_disease: byDisease,
    recent: (detections ?? []).slice(0, 10).map((d) => ({
      id: d.id as string,
      disease: d.disease as string,
      risk_level: d.risk_level as string,
      created_at: d.created_at as string,
    })),
  };
}
