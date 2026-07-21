import { NextRequest, NextResponse } from "next/server";
import { getConfig } from "@/lib/server/config";
import { getAdminClient, listLessons } from "@/lib/server/supabase-admin";

const FALLBACK_LESSONS = [
  {
    id: "local-sigatoka",
    slug: "sigatoka-negra",
    title: "Reconocer y controlar Sigatoka negra",
    crop: "Plátano",
    disease_keywords: ["sigatoka", "mycosphaerella"],
    duration_min: 5,
    content_md:
      "## Qué es\nManchas necróticas alargadas en hojas de plátano.\n\n## Qué hacer hoy\n1. Retirar hojas muy afectadas.\n2. Evitar riego por aspersión.\n3. Aplicar fungicida según etiqueta MAG.\n\n## Seguimiento\nFoto de la misma planta en 72 h.",
  },
  {
    id: "local-monilia",
    slug: "monilia-cacao",
    title: "Monilia en cacao: detección temprana",
    crop: "Cacao",
    disease_keywords: ["monilia"],
    duration_min: 4,
    content_md:
      "## Señales\nFrutos con manchas chocolate que se blanquean.\n\n## Acción\nRetirar frutos enfermos, mejorar aireación, podar sombra.",
  },
  {
    id: "local-roya",
    slug: "roya-cafe",
    title: "Roya del café en Manabí",
    crop: "Café",
    disease_keywords: ["roya"],
    duration_min: 5,
    content_md:
      "## Señales\nPústulas anaranjadas en envés de hoja.\n\n## Acción\nVariedades tolerantes, fertilización balanceada, fungicida preventivo.",
  },
];

export async function GET(req: NextRequest) {
  const disease = req.nextUrl.searchParams.get("disease") ?? undefined;
  const cfg = getConfig();
  const client = getAdminClient(cfg);
  if (client) {
    try {
      const rows = await listLessons(client, disease);
      if (rows.length) return NextResponse.json(rows);
    } catch {
      /* fallback */
    }
  }

  if (!disease) return NextResponse.json(FALLBACK_LESSONS);
  const q = disease.toLowerCase();
  const matched = FALLBACK_LESSONS.filter((l) =>
    l.disease_keywords.some((k) => q.includes(k) || k.includes(q))
  );
  return NextResponse.json(matched.length ? matched : FALLBACK_LESSONS);
}
