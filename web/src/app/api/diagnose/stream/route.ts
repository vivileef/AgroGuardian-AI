import { NextRequest } from "next/server";
import { requireUserId } from "@/lib/server/auth";
import { getConfig } from "@/lib/server/config";
import { getCaseStore } from "@/lib/server/demo-data";
import { runDiagnosisPipeline } from "@/lib/server/orchestrator";
import { getAdminClient, saveDetection } from "@/lib/server/supabase-admin";
import type { AgentTrace } from "@/types/api";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

function sse(event: string, data: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: NextRequest) {
  const { userId, error } = await requireUserId();
  if (error || !userId) return error!;

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof Blob)) {
    return new Response(sse("error", { detail: "Debes subir una imagen." }), {
      status: 400,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  }

  const crop = form.get("crop")?.toString() || null;
  const cropId = form.get("crop_id")?.toString() || null;
  const farmId = form.get("farm_id")?.toString() || null;
  const latRaw = form.get("lat")?.toString();
  const lonRaw = form.get("lon")?.toString();
  const bytes = Buffer.from(await file.arrayBuffer());

  if (bytes.length < 100) {
    return new Response(sse("error", { detail: "Imagen vacía o inválida." }), {
      status: 400,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  }

  const cfg = getConfig();
  const mime = file.type || "image/jpeg";

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      const send = (event: string, data: unknown) => {
        try {
          controller.enqueue(enc.encode(sse(event, data)));
        } catch {
          /* client disconnected */
        }
      };

      try {
        const result = await runDiagnosisPipeline(cfg, bytes, {
          mime,
          cropHint: crop,
          lat: latRaw ? Number(latRaw) : null,
          lon: lonRaw ? Number(lonRaw) : null,
          onProgress: (trace: AgentTrace) => send("progress", trace),
        });

        result.crop_id = cropId;
        result.farm_id = farmId;

        getCaseStore().set(result.id, result);
        const client = getAdminClient(cfg);
        if (client) {
          try {
            const id = await saveDetection(client, userId, result, {
              crop_id: cropId,
              farm_id: farmId,
            });
            result.id = id;
            getCaseStore().set(result.id, result);
          } catch {
            /* optional persistence */
          }
        }

        send("result", result);
      } catch (e) {
        send("error", {
          detail: e instanceof Error ? e.message : "Error al analizar la imagen",
        });
      } finally {
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
