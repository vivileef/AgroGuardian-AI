import OpenAI from "openai";
import { AppConfig, hasOpenRouter } from "./config";

export function getOpenRouterClient(cfg: AppConfig) {
  if (!hasOpenRouter(cfg)) return null;
  return new OpenAI({
    apiKey: cfg.openrouterApiKey,
    baseURL: cfg.openrouterBaseUrl,
  });
}

export function extractJson(text: string): Record<string, unknown> {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed) as Record<string, unknown>;
  } catch {
    /* continue */
  }
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) return JSON.parse(fence[1].trim()) as Record<string, unknown>;
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return JSON.parse(trimmed.slice(start, end + 1)) as Record<string, unknown>;
  }
  throw new Error(`No JSON in model response: ${trimmed.slice(0, 200)}`);
}

export async function chatCompletion(
  cfg: AppConfig,
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  opts?: { model?: string; temperature?: number; maxTokens?: number }
) {
  const client = getOpenRouterClient(cfg);
  if (!client) throw new Error("OpenRouter API key not configured");
  const res = await client.chat.completions.create({
    model: opts?.model ?? cfg.openrouterModel,
    messages,
    temperature: opts?.temperature ?? 0.2,
    max_tokens: opts?.maxTokens ?? 1200,
  });
  return (res.choices[0]?.message?.content ?? "").trim();
}

export async function visionAnalyze(
  cfg: AppConfig,
  imageBytes: Buffer,
  prompt: string,
  mime = "image/jpeg"
) {
  const b64 = imageBytes.toString("base64");
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
    { model: cfg.openrouterVisionModel, temperature: 0.1, maxTokens: 800 }
  );
}
