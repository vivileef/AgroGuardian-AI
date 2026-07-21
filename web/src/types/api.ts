export type RiskLevel = "bajo" | "medio" | "alto" | "critico";

export type DiseaseDetection = {
  disease: string;
  crop: string;
  confidence: number;
  affected_part: string;
  risk_level: RiskLevel;
  rationale: string;
};

export type WeatherSnapshot = {
  temperature_c: number;
  humidity_pct: number;
  rain_mm: number;
  wind_kmh: number;
  condition: string;
  climate_risk: RiskLevel;
  source: string;
  location: string;
};

export type Recommendation = {
  id?: string;
  title: string;
  detail: string;
  priority: number;
  timeframe: string;
  completed?: boolean;
};

export type FollowUpPlan = {
  check_in_hours: number;
  steps: string[];
};

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
  detection: DiseaseDetection;
  weather: WeatherSnapshot;
  diagnosis: string;
  recommendations: Recommendation[];
  follow_up: FollowUpPlan;
  agent_trace: AgentTrace[];
  demo: boolean;
  image_path?: string | null;
  farm_id?: string | null;
  crop_id?: string | null;
};

export type OnboardingPayload = {
  fullName: string;
  farmName: string;
  province: string;
  hectares: number;
  crops: string[];
};
