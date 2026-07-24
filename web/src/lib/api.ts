function apiBase() {
  if (typeof window !== "undefined") return "";
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
}

export type RiskLevel = "bajo" | "medio" | "alto" | "critico";

export type AgentTrace = {
  agent: string;
  status: string;
  summary: string;
  duration_ms: number;
  data?: Record<string, unknown>;
};

export type DiagnosisResult = {
  id: string;
  created_at: string;
  detection: {
    disease: string;
    crop: string;
    confidence: number;
    affected_part: string;
    risk_level: RiskLevel;
    rationale: string;
  };
  weather: {
    temperature_c: number;
    humidity_pct: number;
    rain_mm: number;
    wind_kmh: number;
    condition: string;
    climate_risk: RiskLevel;
    source: string;
    location: string;
  };
  diagnosis: string;
  recommendations: {
    id?: string;
    title: string;
    detail: string;
    priority: number;
    timeframe: string;
    completed?: boolean;
  }[];
  follow_up: {
    check_in_hours: number;
    steps: string[];
  };
  agent_trace: AgentTrace[];
  demo: boolean;
  image_path?: string | null;
  farm_id?: string | null;
  crop_id?: string | null;
};

export type WeatherSnapshot = DiagnosisResult["weather"];

export type Farm = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  area_ha: number;
  health_status: "sano" | "riesgo" | "infectado";
  owner_id?: string;
  created_at?: string;
};

export type Crop = {
  id: string;
  farm_id: string;
  name: string;
  variety: string;
  growth_stage: string;
  health_pct: number;
  status: "sano" | "riesgo" | "infectado";
  hectares: number;
};

export type DashboardStats = {
  active_crops: number;
  detected_cases: number;
  climate_risk: string;
  avg_health: number;
  crop_status: { healthy: number; risk: number; infected: number };
};

export type MarketPrice = {
  crop: string;
  price_usd: number;
  unit: string;
  trend: "up" | "down" | "stable";
  market: string;
  updated: string;
};

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${apiBase()}${path}`, { ...init, credentials: "same-origin" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Error ${res.status}`);
  }
  return res;
}

function normalizeFarm(row: Record<string, unknown>): Farm {
  return {
    id: String(row.id),
    name: String(row.name),
    lat: Number(row.lat ?? -1.0547),
    lng: Number(row.lng ?? -80.4545),
    area_ha: Number(row.area_ha ?? row.hectares ?? 1),
    health_status: (row.health_status ?? row.status ?? "sano") as Farm["health_status"],
    owner_id: row.owner_id ? String(row.owner_id) : undefined,
    created_at: row.created_at ? String(row.created_at) : undefined,
  };
}

function normalizeCrop(row: Record<string, unknown>): Crop {
  return {
    id: String(row.id),
    farm_id: String(row.farm_id ?? "f1"),
    name: String(row.name),
    variety: String(row.variety ?? ""),
    growth_stage: String(row.growth_stage ?? row.stage ?? "Desarrollo"),
    health_pct: Number(row.health_pct ?? row.health ?? 80),
    status: (row.status ?? "sano") as Crop["status"],
    hectares: Number(row.hectares ?? 1),
  };
}

export async function getHealth() {
  const res = await apiFetch("/api/health", { cache: "no-store" });
  return res.json() as Promise<{
    status: string;
    demo_mode: boolean;
    openrouter: boolean;
    openweather: boolean;
    supabase: boolean;
    models: { text: string; vision: string };
  }>;
}

export async function getOnboardingStatus() {
  const res = await apiFetch("/api/onboarding", { cache: "no-store" });
  return res.json() as Promise<{ completed: boolean; mode?: string }>;
}

export async function submitOnboarding(data: {
  fullName: string;
  farmName: string;
  province: string;
  hectares: number;
  crops: string[];
}) {
  const res = await apiFetch("/api/onboarding", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getFarms() {
  const res = await apiFetch("/api/farms", { cache: "no-store" });
  const rows = (await res.json()) as Record<string, unknown>[];
  return rows.map(normalizeFarm);
}

export async function createFarm(payload: {
  name: string;
  lat?: number;
  lng?: number;
  area_ha?: number;
}) {
  const res = await apiFetch("/api/farms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return normalizeFarm(await res.json());
}

export async function getCrops(farmId?: string) {
  const q = farmId ? `?farm_id=${encodeURIComponent(farmId)}` : "";
  const res = await apiFetch(`/api/farms/crops${q}`, { cache: "no-store" });
  const rows = (await res.json()) as Record<string, unknown>[];
  return rows.map(normalizeCrop);
}

export async function createCrop(payload: {
  farm_id: string;
  name: string;
  variety?: string;
  growth_stage?: string;
  hectares?: number;
}) {
  const res = await apiFetch("/api/farms/crops", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return normalizeCrop(await res.json());
}

export async function getDashboardStats() {
  const res = await apiFetch("/api/dashboard/stats", { cache: "no-store" });
  return res.json() as Promise<DashboardStats>;
}

export async function getMarketPrices() {
  const res = await apiFetch("/api/markets/prices", { cache: "no-store" });
  return res.json() as Promise<MarketPrice[]>;
}

export async function getWeather(lat?: number, lon?: number) {
  const params = new URLSearchParams();
  if (lat != null) params.set("lat", String(lat));
  if (lon != null) params.set("lon", String(lon));
  const q = params.toString() ? `?${params}` : "";
  const res = await fetch(`${apiBase()}/api/weather${q}`, { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo obtener el clima");
  return res.json() as Promise<WeatherSnapshot>;
}

export type ForecastDay = {
  date: string;
  day_label: string;
  temp_max: number;
  temp_min: number;
  rain_mm: number;
  rain_prob: number;
  humidity_avg: number;
  condition: string;
  climate_risk: RiskLevel;
  spray_ok: boolean;
  spray_note: string;
};

export type WeatherBundle = {
  current: WeatherSnapshot;
  forecast: ForecastDay[];
  spray_window: {
    can_spray_today: boolean;
    reason: string;
    best_day: string | null;
  };
};

export async function getWeatherBundle(lat?: number, lon?: number) {
  const params = new URLSearchParams({ forecast: "1" });
  if (lat != null) params.set("lat", String(lat));
  if (lon != null) params.set("lon", String(lon));
  const res = await fetch(`${apiBase()}/api/weather?${params}`, {
    cache: "no-store",
    credentials: "same-origin",
  });
  if (!res.ok) throw new Error("No se pudo obtener el clima");
  return res.json() as Promise<WeatherBundle>;
}

export type AppNotification = {
  id: string;
  title: string;
  body: string | null;
  severity: string;
  read: boolean;
  created_at: string;
};

export async function getNotifications() {
  const res = await apiFetch("/api/notifications", { cache: "no-store" });
  return res.json() as Promise<AppNotification[]>;
}

export async function markNotificationRead(id: string) {
  const res = await apiFetch("/api/notifications", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  return res.json();
}

export async function setRecommendationDone(id: string, completed: boolean) {
  const res = await apiFetch("/api/recommendations", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, completed }),
  });
  return res.json();
}

export type Plot = {
  id: string;
  farm_id: string;
  name: string;
  area_ha: number;
  lat?: number | null;
  lng?: number | null;
  health_status: string;
};

export async function getPlots(farmId?: string) {
  const q = farmId ? `?farm_id=${encodeURIComponent(farmId)}` : "";
  const res = await apiFetch(`/api/plots${q}`, { cache: "no-store" });
  return res.json() as Promise<Plot[]>;
}

export async function createPlot(payload: {
  farm_id: string;
  name: string;
  area_ha?: number;
  lat?: number;
  lng?: number;
}) {
  const res = await apiFetch("/api/plots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json() as Promise<Plot>;
}

export async function updatePlot(
  id: string,
  payload: { name?: string; area_ha?: number; lat?: number; lng?: number }
) {
  const res = await apiFetch(`/api/plots/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json() as Promise<Plot>;
}

export async function deletePlot(id: string) {
  const res = await apiFetch(`/api/plots/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return res.json() as Promise<{ ok: boolean }>;
}

export type Lesson = {
  id: string;
  slug: string;
  title: string;
  crop: string | null;
  infection_type?: "Hongo" | "Bacteria" | "Virus" | "Plaga" | "Fisiopatia";
  disease_keywords: string[];
  duration_min: number;
  content_md: string;
  description?: string;
  prevention_steps?: string[];
  image_src?: string;
  image_alt?: string;
  symptoms?: string[];
};

export async function getLessons(disease?: string) {
  const q = disease ? `?disease=${encodeURIComponent(disease)}` : "";
  const res = await fetch(`${apiBase()}/api/lessons${q}`, { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudieron cargar las lecciones");
  return res.json() as Promise<Lesson[]>;
}

export async function getCase(id: string) {
  const res = await apiFetch(`/api/diagnose/${id}`, { cache: "no-store" });
  return res.json() as Promise<DiagnosisResult>;
}

export async function deleteCase(id: string) {
  const res = await apiFetch(`/api/diagnose/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return res.json() as Promise<{ ok: boolean }>;
}

export async function regenerateCase(
  id: string,
  opts?: { lat?: number; lon?: number }
) {
  const res = await apiFetch(`/api/diagnose/${encodeURIComponent(id)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "regenerate", ...opts }),
  });
  return res.json() as Promise<DiagnosisResult>;
}

export async function getReportSummary(days = 30) {
  const res = await apiFetch(`/api/reports/summary?days=${days}`, { cache: "no-store" });
  return res.json() as Promise<{
    period_days: number;
    scans: number;
    treatments_done: number;
    treatments_pending: number;
    by_disease: Record<string, number>;
    recent: { id: string; disease: string; risk_level: string; created_at: string }[];
  }>;
}

export type DiagnoseMeta = {
  crop?: string;
  lat?: number;
  lon?: number;
  farm_id?: string;
  crop_id?: string;
};

function appendMeta(form: FormData, meta?: DiagnoseMeta) {
  if (meta?.crop) form.append("crop", meta.crop);
  if (meta?.lat != null) form.append("lat", String(meta.lat));
  if (meta?.lon != null) form.append("lon", String(meta.lon));
  if (meta?.farm_id) form.append("farm_id", meta.farm_id);
  if (meta?.crop_id) form.append("crop_id", meta.crop_id);
}

export async function diagnoseImage(file: Blob, meta?: DiagnoseMeta) {
  const form = new FormData();
  const name = file instanceof File ? file.name : "capture.jpg";
  form.append("file", file, name);
  appendMeta(form, meta);

  const res = await fetch(`${apiBase()}/api/diagnose`, {
    method: "POST",
    credentials: "same-origin",
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Error al analizar la imagen");
  }
  return res.json() as Promise<DiagnosisResult>;
}

export async function diagnoseImageStream(
  file: Blob,
  meta: DiagnoseMeta | undefined,
  handlers: {
    onProgress: (trace: AgentTrace) => void;
    onResult: (result: DiagnosisResult) => void;
    onError?: (message: string) => void;
  }
) {
  const form = new FormData();
  const name = file instanceof File ? file.name : "capture.jpg";
  form.append("file", file, name);
  appendMeta(form, meta);

  const res = await fetch(`${apiBase()}/api/diagnose/stream`, {
    method: "POST",
    credentials: "same-origin",
    body: form,
  });
  if (!res.ok || !res.body) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { detail?: string }).detail ||
        `Error al analizar la imagen (${res.status})`
    );
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let gotResult = false;
  let streamError: string | null = null;

  const consume = (chunk: string) => {
    const lines = chunk.split("\n");
    let event = "message";
    const dataLines: string[] = [];
    for (const line of lines) {
      if (line.startsWith("event:")) event = line.slice(6).trim();
      else if (line.startsWith("data:")) dataLines.push(line.slice(5).trimStart());
    }
    const data = dataLines.join("\n");
    if (!data) return;
    try {
      const parsed = JSON.parse(data) as Record<string, unknown>;
      if (event === "progress") handlers.onProgress(parsed as unknown as AgentTrace);
      else if (event === "result") {
        gotResult = true;
        handlers.onResult(parsed as unknown as DiagnosisResult);
      } else if (event === "error") {
        streamError = String(parsed.detail || "Error en el pipeline");
        handlers.onError?.(streamError);
      }
    } catch {
      /* ignore partial JSON */
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() || "";
    for (const chunk of chunks) consume(chunk);
  }

  // Flush trailing buffer (some runtimes omit final blank line)
  if (buffer.trim()) consume(buffer);

  if (gotResult) return;
  if (streamError) throw new Error(streamError);
  throw new Error(
    "El análisis se interrumpió. Reintenta; si sigue fallando, revisa OPENROUTER_API_KEY y OPENROUTER_VISION_MODEL en Vercel."
  );
}

export async function getCases() {
  const res = await apiFetch("/api/cases", { cache: "no-store" });
  return res.json() as Promise<DiagnosisResult[]>;
}

export async function chatAssistant(message: string, history: { role: string; content: string }[] = []) {
  const res = await apiFetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history, province: "Manabí" }),
  });
  return res.json() as Promise<{ reply: string; sources: string[]; demo: boolean }>;
}

export function pdfUrl(caseId: string) {
  return `${apiBase()}/api/diagnose/${caseId}/pdf`;
}
