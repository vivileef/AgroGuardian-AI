import { NextRequest, NextResponse } from "next/server";
import { getConfig } from "@/lib/server/config";
import { getAdminClient, listLessons } from "@/lib/server/supabase-admin";

export type EncyclopediaEntry = {
  id: string;
  slug: string;
  title: string;
  crop: string;
  infection_type: "Hongo" | "Bacteria" | "Virus" | "Plaga" | "Fisiopatia";
  disease_keywords: string[];
  duration_min: number;
  description: string;
  prevention_steps: string[];
  content_md: string;
  image_src: string;
  image_alt: string;
  symptoms: string[];
};

const FALLBACK_LESSONS: EncyclopediaEntry[] = [
  {
    id: "local-sigatoka",
    slug: "sigatoka-negra",
    title: "Sigatoka negra",
    crop: "Plátano / Banano",
    infection_type: "Hongo",
    disease_keywords: ["sigatoka", "mycosphaerella", "negra"],
    duration_min: 5,
    image_src: "/samples/sigatoka.jpg",
    image_alt: "Hoja de plátano con lesiones de Sigatoka negra",
    symptoms: [
      "Manchas alargadas necróticas",
      "Halo clorótico amarillo",
      "Secado desde el borde de la hoja",
    ],
    description:
      "La Sigatoka negra es una enfermedad foliar causada por el hongo Pseudocercospora fijiensis (Mycosphaerella fijiensis). Reduce el área fotosintética de la planta, debilita el desarrollo del racimo y puede ocasionar pérdidas importantes de rendimiento si no se controla a tiempo. Se favorece con alta humedad relativa, lluvias frecuentes y plantaciones densas con poca circulación de aire.",
    prevention_steps: [
      "Mantener un programa de deshoje sanitario: retirar hojas muy afectadas y sacarlas del lote.",
      "Mejorar la aireación del cultivo evitando densidades excesivas y maleza alta.",
      "No regar por aspersión en horas de alta humedad; preferir riego dirigido al suelo.",
      "Aplicar fungicidas autorizados según etiqueta y rotación de modos de acción (MAG).",
      "Monitorear semanalmente las hojas jóvenes y registrar el avance de lesiones.",
      "Tomar una foto de seguimiento a las 72 horas para evaluar si el control está funcionando.",
    ],
    content_md: "",
  },
  {
    id: "local-monilia",
    slug: "monilia-cacao",
    title: "Monilia del cacao",
    crop: "Cacao",
    infection_type: "Hongo",
    disease_keywords: ["monilia", "moniliophthora"],
    duration_min: 4,
    image_src: "/samples/cacao-monilia.jpg",
    image_alt: "Mazorca de cacao con Monilia",
    symptoms: [
      "Manchas color chocolate en el fruto",
      "Superficie que se blanquea",
      "Frutos momificados",
    ],
    description:
      "La moniliasis del cacao, producida por Moniliophthora roreri, es una de las principales enfermedades de la mazorca en la costa ecuatoriana. El hongo infecta frutos en desarrollo, provoca manchas chocolate que luego se cubren de esporas blancas y termina momificando la mazorca. La presión de inóculo aumenta con humedad prolongada, sombra excesiva y frutos enfermos dejados en el árbol o en el suelo.",
    prevention_steps: [
      "Cosechar con frecuencia (cada 7 a 15 días) para reducir frutos susceptibles en el árbol.",
      "Retirar y destruir mazorcas enfermas; no dejarlas bajo la planta.",
      "Regular la sombra para mejorar aireación y reducir humedad relativa en la plantación.",
      "Podar ramas bajas o densas que impidan la circulación de aire.",
      "Desinfectar herramientas de poda entre plantas o lotes.",
      "Registrar focos semanales y priorizar saneamiento donde haya más frutos afectados.",
    ],
    content_md: "",
  },
  {
    id: "local-roya-maiz",
    slug: "roya-maiz",
    title: "Roya del maíz",
    crop: "Maíz",
    infection_type: "Hongo",
    disease_keywords: ["roya", "maíz", "maiz", "puccinia"],
    duration_min: 5,
    image_src: "/samples/maiz-roya.jpg",
    image_alt: "Hoja de maíz con pústulas de roya",
    symptoms: [
      "Pústulas anaranjadas o cafés",
      "Polvillo al frotar la hoja",
      "Reducción de área verde",
    ],
    description:
      "La roya del maíz es una enfermedad foliar asociada a hongos del género Puccinia. Se manifiesta con pústulas pulverulentas de color anaranjado a café sobre las hojas; al frotarlas liberan esporas. En condiciones de humedad y temperaturas moderadas puede reducir la capacidad fotosintética y afectar el llenado de grano, especialmente en híbridos susceptibles.",
    prevention_steps: [
      "Sembrar híbridos con tolerancia documentada a roya en la zona.",
      "Evitar exceso de nitrógeno que genere follaje muy denso y húmedo.",
      "Monitorear el envés y haz de las hojas desde etapas vegetativas medias.",
      "Aplicar fungicida preventivo solo si el umbral de incidencia lo justifica.",
      "Eliminar rastrojos infectados al final del ciclo cuando sea práctico.",
      "Rotar cultivos o variedades para disminuir la presión del inóculo.",
    ],
    content_md: "",
  },
  {
    id: "local-roya-cafe",
    slug: "roya-cafe",
    title: "Roya del café",
    crop: "Café",
    infection_type: "Hongo",
    disease_keywords: ["roya", "café", "cafe", "hemileia"],
    duration_min: 5,
    image_src: "/samples/maiz-roya.jpg",
    image_alt: "Referencia de pústulas tipo roya en hoja",
    symptoms: [
      "Pústulas anaranjadas en el envés",
      "Defoliación temprana",
      "Baja producción de grano",
    ],
    description:
      "La roya del café (Hemileia vastatrix) es un hongo biótrofo que coloniza el envés de la hoja y forma pústulas anaranjadas. Provoca defoliación prematura, debilita la planta y reduce la producción de grano en ciclos siguientes. La epidemia se intensifica con lluvias frecuentes, niebla y plantaciones con nutrición desbalanceada o variedades susceptibles.",
    prevention_steps: [
      "Preferir variedades tolerantes o resistentes recomendadas para la zona.",
      "Mantener fertilización balanceada (N-P-K y micronutrientes) según análisis de suelo.",
      "Regular sombra para evitar humedad excesiva sobre el follaje.",
      "Realizar muestreos de hojas cada 15 días en época lluviosa.",
      "Aplicar fungicidas preventivos según calendario técnico y etiqueta.",
      "Retirar hojas muy defoliadas del suelo en focos intensos cuando sea viable.",
    ],
    content_md: "",
  },
  {
    id: "local-fusarium",
    slug: "fusarium-platano",
    title: "Marchitez por Fusarium (mal de Panamá)",
    crop: "Plátano / Banano",
    infection_type: "Hongo",
    disease_keywords: ["fusarium", "panama", "marchitez"],
    duration_min: 6,
    image_src: "/samples/sigatoka.jpg",
    image_alt: "Referencia foliar en plátano; confirmar vascular en campo",
    symptoms: [
      "Amarillamiento de hojas externas",
      "Rajadura del pseudotallo",
      "Necrosis interna del vaso",
    ],
    description:
      "El mal de Panamá es una marchitez vascular causada por Fusarium oxysporum f. sp. cubense. El hongo coloniza el sistema vascular, interrumpe el transporte de agua y nutrientes, y puede generar amarillamiento progresivo, rajaduras del pseudotallo y necrosis interna. Es de alto riesgo sanitario porque se dispersa con suelo, agua de riego, herramientas y material de siembra contaminado.",
    prevention_steps: [
      "Usar únicamente plantines certificados y de origen conocido.",
      "Desinfectar machetes, pala y calzado al entrar o salir de un lote sospechoso.",
      "No mover cormos, hojas ni suelo desde focos sospechosos hacia lotes sanos.",
      "Aislar plantas con síntomas y marcar el perímetro del foco.",
      "Mejorar drenaje para evitar encharcamientos prolongados.",
      "Reportar de inmediato a un técnico MAG ante sospecha confirmada en campo.",
    ],
    content_md: "",
  },
  {
    id: "local-trips",
    slug: "trips-platano",
    title: "Trips en plátano",
    crop: "Plátano / Banano",
    infection_type: "Plaga",
    disease_keywords: ["trips", "insecto"],
    duration_min: 4,
    image_src: "/samples/sigatoka.jpg",
    image_alt: "Daño típico asociado a monitoreo en plátano",
    symptoms: [
      "Manchas plateadas en la cáscara",
      "Aspecto corchoso del fruto",
      "Daño cosmético del racimo",
    ],
    description:
      "Los trips son insectos de tamaño reducido que alimentan sobre frutos jóvenes de plátano y banano. Su daño es principalmente cosmético: generan manchas plateadas o corchosas en la cáscara que reducen el valor comercial del racimo. La incidencia suele aumentar tras lluvias, en periodos de brotación floral y cuando el bolseo se realiza tarde.",
    prevention_steps: [
      "Realizar el bolseo del racimo en el momento oportuno tras la floración.",
      "Instalar trampas azules adhesivas para monitoreo de adultos.",
      "Inspeccionar racimos jóvenes después de eventos de lluvia intensa.",
      "Mantener maleza controlada en bordes del lote donde se refugian insectos.",
      "Usar control biológico o insecticidas selectivos solo si se supera el umbral.",
      "Registrar semanalmente el porcentaje de racimos con daño cosmético.",
    ],
    content_md: "",
  },
  {
    id: "local-bacteria-cacao",
    slug: "bacteriosis-cacao",
    title: "Mancha bacteriana en cacao",
    crop: "Cacao",
    infection_type: "Bacteria",
    disease_keywords: ["bacteria", "bacteriosis", "cacao"],
    duration_min: 4,
    image_src: "/samples/cacao-monilia.jpg",
    image_alt: "Referencia de daño en mazorca de cacao",
    symptoms: [
      "Manchas húmedas en hoja o fruto",
      "Exudado en condiciones de alta humedad",
      "Avance irregular de la lesión",
    ],
    description:
      "Las manchas bacterianas en cacao se asocian a infecciones que penetran por heridas o aberturas naturales bajo alta humedad. Las lesiones suelen verse aceitosas o irregulares y pueden exudar en condiciones favorables. Se diferencian de la monilia porque no siempre momifican el fruto completo ni producen el mismo patrón de esporulación superficial.",
    prevention_steps: [
      "Evitar podas agresivas en plena época lluviosa.",
      "Desinfectar herramientas de corte entre plantas.",
      "Mejorar aireación del cacao para secar más rápido el follaje y frutos.",
      "Retirar órganos muy afectados y sacarlos del lote.",
      "Reducir salpicadura de suelo hacia frutos bajos con cobertura o manejo de maleza.",
      "Confirmar con técnico si hay duda frente a monilia u otras enfermedades del fruto.",
    ],
    content_md: "",
  },
  {
    id: "local-suelo",
    slug: "lectura-suelo-basica",
    title: "Estrés por suelo y riego",
    crop: "General",
    infection_type: "Fisiopatia",
    disease_keywords: ["suelo", "riego", "humedad", "estres"],
    duration_min: 5,
    image_src: "/samples/maiz-roya.jpg",
    image_alt: "Referencia visual de hoja bajo estrés",
    symptoms: [
      "Amarillamiento uniforme",
      "Encharcamiento o sequía",
      "Sin pústulas ni esporas evidentes",
    ],
    description:
      "No todo síntoma foliar indica una infección. El estrés por suelo compactado, drenaje deficiente, exceso de riego o sequía puede producir amarillamiento uniforme y pérdida de vigor sin presencia de esporas, pústulas o lesiones típicas de patógenos. Distinguir fisiopatías evita tratamientos innecesarios y corrige la causa real del problema.",
    prevention_steps: [
      "Revisar encharcamientos 24 a 48 horas después de lluvias fuertes.",
      "Mejorar drenajes en zonas bajas del lote antes de la temporada lluviosa.",
      "Evitar riego foliar en horas de máxima humedad relativa.",
      "Observar si el amarillamiento es uniforme (fisiopatía) o en manchas locales (posible infección).",
      "Ajustar fertilización según análisis de suelo y etapa del cultivo.",
      "Usar el módulo de clima de AgroGuardian para correlacionar humedad y riesgo sanitario.",
    ],
    content_md: "",
  },
];

function normalizeLesson(row: Record<string, unknown>): EncyclopediaEntry {
  const slug = String(row.slug ?? row.id ?? "leccion");
  const matched = FALLBACK_LESSONS.find((l) => l.slug === slug);
  const prevention = Array.isArray(row.prevention_steps)
    ? (row.prevention_steps as string[])
    : matched?.prevention_steps ?? [];

  return {
    id: String(row.id ?? matched?.id ?? slug),
    slug,
    title: String(row.title ?? matched?.title ?? "Lección"),
    crop: String(row.crop ?? matched?.crop ?? "General"),
    infection_type:
      (row.infection_type as EncyclopediaEntry["infection_type"]) ??
      matched?.infection_type ??
      "Hongo",
    disease_keywords: Array.isArray(row.disease_keywords)
      ? (row.disease_keywords as string[])
      : matched?.disease_keywords ?? [],
    duration_min: Number(row.duration_min ?? matched?.duration_min ?? 5),
    description: String(row.description ?? matched?.description ?? row.content_md ?? ""),
    prevention_steps: prevention,
    content_md: String(row.content_md ?? matched?.content_md ?? ""),
    image_src: String(row.image_src ?? matched?.image_src ?? "/samples/sigatoka.jpg"),
    image_alt: String(row.image_alt ?? matched?.image_alt ?? row.title ?? "Referencia"),
    symptoms: Array.isArray(row.symptoms)
      ? (row.symptoms as string[])
      : matched?.symptoms ?? [],
  };
}

export async function GET(req: NextRequest) {
  const disease = req.nextUrl.searchParams.get("disease") ?? undefined;
  const cfg = getConfig();
  const client = getAdminClient(cfg);

  if (client) {
    try {
      const rows = await listLessons(client, disease);
      if (rows.length) {
        return NextResponse.json(
          rows.map((r) => normalizeLesson(r as unknown as Record<string, unknown>))
        );
      }
    } catch {
      /* fallback */
    }
  }

  if (!disease) return NextResponse.json(FALLBACK_LESSONS);
  const q = disease.toLowerCase();
  const matched = FALLBACK_LESSONS.filter(
    (l) =>
      l.disease_keywords.some((k) => q.includes(k) || k.includes(q)) ||
      l.title.toLowerCase().includes(q) ||
      l.crop.toLowerCase().includes(q)
  );
  return NextResponse.json(matched.length ? matched : FALLBACK_LESSONS);
}
