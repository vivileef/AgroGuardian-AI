import OpenAI from "openai";
import { AppConfig, hasOpenRouter } from "./config";

export function getOpenRouterClient(cfg: AppConfig) {
  if (!hasOpenRouter(cfg)) return null;
  return new OpenAI({
    apiKey: cfg.openrouterApiKey,
    baseURL: cfg.openrouterBaseUrl,
    defaultHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://agro-guardian-ai-bice.vercel.app",
      "X-Title": "AgroGuardian AI",
    },
  });
}

export function extractJson(text: string): Record<string, unknown> {
  const trimmed = text.trim();
  if (!trimmed) throw new Error("Respuesta vacía del modelo");
  try {
    return JSON.parse(trimmed) as Record<string, unknown>;
  } catch {
    /* continue */
  }
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) {
    try {
      return JSON.parse(fence[1].trim()) as Record<string, unknown>;
    } catch {
      /* continue */
    }
  }
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return JSON.parse(trimmed.slice(start, end + 1)) as Record<string, unknown>;
  }
  throw new Error(`No JSON in model response: ${trimmed.slice(0, 200)}`);
}

function friendlyOpenRouterError(e: unknown): Error {
  const msg = e instanceof Error ? e.message : String(e);
  if (/401|unauthorized|invalid.*key/i.test(msg)) {
    return new Error("OPENROUTER_API_KEY inválida o ausente en Vercel.");
  }
  if (/404|not found|no endpoints/i.test(msg)) {
    return new Error(
      "Modelo OpenRouter no disponible. Revisa OPENROUTER_VISION_MODEL / OPENROUTER_MODEL (usa IDs :free vigentes)."
    );
  }
  if (/429|rate limit/i.test(msg)) {
    return new Error("Límite de tasa de OpenRouter. Espera un minuto e intenta de nuevo.");
  }
  return e instanceof Error ? e : new Error(msg);
}

export async function chatCompletion(
  cfg: AppConfig,
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  opts?: { model?: string; temperature?: number; maxTokens?: number; fallbackModels?: string[] }
) {
  const client = getOpenRouterClient(cfg);
  if (!client) throw new Error("OpenRouter API key not configured");

  const models = [
    opts?.model ?? cfg.openrouterModel,
    ...(opts?.fallbackModels ?? []),
  ].filter((m, i, arr) => Boolean(m) && arr.indexOf(m) === i);

  let lastErr: unknown;
  for (const model of models) {
    try {
      const res = await client.chat.completions.create({
        model,
        messages,
        temperature: opts?.temperature ?? 0.2,
        max_tokens: opts?.maxTokens ?? 1200,
      });
      const content = (res.choices[0]?.message?.content ?? "").trim();
      if (!content) {
        lastErr = new Error(`Modelo ${model} devolvió respuesta vacía`);
        continue;
      }
      return content;
    } catch (e) {
      lastErr = e;
    }
  }
  throw friendlyOpenRouterError(lastErr);
}

/** Free vision-capable models that rotate; first env override, then known fallbacks. */
const VISION_FALLBACKS = [
  "google/gemma-3-27b-it:free",
  "meta-llama/llama-3.2-11b-vision-instruct:free",
  "qwen/qwen2.5-vl-32b-instruct:free",
  "google/gemini-2.0-flash-exp:free",
];

export async function visionAnalyze(
  cfg: AppConfig,
  imageBytes: Buffer,
  prompt: string,
  mime = "image/jpeg"
) {
  const b64 = imageBytes.toString("base64");
  const primary = cfg.openrouterVisionModel;
  const fallbacks = VISION_FALLBACKS.filter((m) => m !== primary);

  return chatCompletion(
    cfg,
    [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: `data:${mime};base64,${b64}` } },
        ],
      },
    ],
    {
      model: primary,
      fallbackModels: fallbacks,
      temperature: 0.1,
      maxTokens: 800,
    }
  );
}
