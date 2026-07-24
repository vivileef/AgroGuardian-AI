const fs = require("fs");
const path = require("path");

const CATEGORIES = [
  ["Nutricion", "Nutrición vegetal"],
  ["Agua", "Riego y drenaje"],
  ["Sanidad", "Sanidad vegetal"],
  ["Suelo", "Manejo de suelos"],
  ["Clima", "Clima y riesgo"],
  ["Cacao", "Cultivo de cacao"],
  ["Platano", "Cultivo de plátano"],
  ["Maiz", "Cultivo de maíz"],
  ["Cafe", "Cultivo de café"],
  ["MIP", "Manejo integrado"],
];

const LEVELS = ["Básico", "Intermedio", "Avanzado"];

const VIDEOS = [
  { youtubeId: "dD0-rimvGL4", label: "Doctores de los suelos · banano y plátano (FAO)" },
  { youtubeId: "AUSyu0BvgFw", label: "Agricultura tropical 4.0 y agua · cacao (UTM Manabí)" },
  { youtubeId: "ucP3AAhqCgk", label: "Cacao en sistemas agroforestales" },
  { youtubeId: "UI2_QX1au-w", label: "Agricultura de bajo impacto y resiliente al clima" },
  { youtubeId: "q6CISyF9TWs", label: "Tutorial de fertilización NPK / fertirriego" },
  { youtubeId: "8-eFCaOYof0", label: "Diseño hidráulico y agronómico de riego tecnificado" },
];

const FOCUS = [
  "diagnóstico en campo",
  "muestreo representativo",
  "registro del lote",
  "toma de decisiones",
  "prevención temprana",
  "evaluación semanal",
  "uso racional de insumos",
  "trazabilidad básica",
  "lectura de síntomas",
  "plan de seguimiento",
];

const ACTIONS = [
  "Identifica el problema y anota el lote afectado.",
  "Observa síntomas o condiciones en al menos 10 plantas del área.",
  "Revisa humedad, drenaje y sombra del microclima.",
  "Aplica primero la práctica cultural recomendada antes de químicos.",
  "Documenta fecha, labor, dosis o evidencia fotográfica.",
  "Evalúa el resultado a los 3–7 días y ajusta el plan del lote.",
];

const modules = [];
for (let i = 1; i <= 100; i++) {
  const cat = CATEGORIES[(i - 1) % CATEGORIES.length];
  const level = LEVELS[(i - 1) % LEVELS.length];
  const video = VIDEOS[(i - 1) % VIDEOS.length];
  const focus = FOCUS[(i - 1) % FOCUS.length];
  modules.push({
    id: `mod-${String(i).padStart(3, "0")}`,
    number: i,
    title: `Módulo ${String(i).padStart(2, "0")}: ${cat[1]} — ${focus}`,
    category: cat[1],
    categoryKey: cat[0],
    duration_min: 8 + ((i * 3) % 10),
    level,
    summary: `Capacitación agronómica aplicada a ${cat[1].toLowerCase()} con énfasis en ${focus}. Orientada a productores de Manabí y la costa ecuatoriana.`,
    objectives: [
      `Comprender el concepto clave de ${focus} en ${cat[1].toLowerCase()}.`,
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento.",
    ],
    steps: ACTIONS,
    video,
  });
}

const file = `export type CapacitacionLevel = "Básico" | "Intermedio" | "Avanzado";

export type CapacitacionModule = {
  id: string;
  number: number;
  title: string;
  category: string;
  categoryKey: string;
  duration_min: number;
  level: CapacitacionLevel;
  summary: string;
  objectives: string[];
  steps: string[];
  video: { youtubeId: string; label: string };
};

export const CAPACITACION_VIDEOS = ${JSON.stringify(VIDEOS, null, 2)} as const;

export const CAPACITACION_MODULES: CapacitacionModule[] = ${JSON.stringify(modules, null, 2)};

export const CAPACITACION_CATEGORIES = Array.from(
  new Set(CAPACITACION_MODULES.map((m) => m.category))
);
`;

const out = path.join(__dirname, "..", "web", "src", "lib", "capacitaciones-data.ts");
fs.writeFileSync(out, file, "utf8");
console.log("Wrote", out, "modules:", modules.length);
