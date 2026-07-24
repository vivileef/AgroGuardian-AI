export type CapacitacionLevel = "Básico" | "Intermedio" | "Avanzado";

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

export const CAPACITACION_VIDEOS = [
  {
    "youtubeId": "dD0-rimvGL4",
    "label": "Doctores de los suelos · banano y plátano (FAO)"
  },
  {
    "youtubeId": "AUSyu0BvgFw",
    "label": "Agricultura tropical 4.0 y agua · cacao (UTM Manabí)"
  },
  {
    "youtubeId": "ucP3AAhqCgk",
    "label": "Cacao en sistemas agroforestales"
  },
  {
    "youtubeId": "UI2_QX1au-w",
    "label": "Agricultura de bajo impacto y resiliente al clima"
  },
  {
    "youtubeId": "q6CISyF9TWs",
    "label": "Tutorial de fertilización NPK / fertirriego"
  },
  {
    "youtubeId": "8-eFCaOYof0",
    "label": "Diseño hidráulico y agronómico de riego tecnificado"
  }
] as const;

export const CAPACITACION_MODULES: CapacitacionModule[] = [
  {
    "id": "mod-001",
    "number": 1,
    "title": "Módulo 01: Nutrición vegetal — diagnóstico en campo",
    "category": "Nutrición vegetal",
    "categoryKey": "Nutricion",
    "duration_min": 11,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a nutrición vegetal con énfasis en diagnóstico en campo. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de diagnóstico en campo en nutrición vegetal.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "dD0-rimvGL4",
      "label": "Doctores de los suelos · banano y plátano (FAO)"
    }
  },
  {
    "id": "mod-002",
    "number": 2,
    "title": "Módulo 02: Riego y drenaje — muestreo representativo",
    "category": "Riego y drenaje",
    "categoryKey": "Agua",
    "duration_min": 14,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a riego y drenaje con énfasis en muestreo representativo. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de muestreo representativo en riego y drenaje.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "AUSyu0BvgFw",
      "label": "Agricultura tropical 4.0 y agua · cacao (UTM Manabí)"
    }
  },
  {
    "id": "mod-003",
    "number": 3,
    "title": "Módulo 03: Sanidad vegetal — registro del lote",
    "category": "Sanidad vegetal",
    "categoryKey": "Sanidad",
    "duration_min": 17,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a sanidad vegetal con énfasis en registro del lote. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de registro del lote en sanidad vegetal.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "ucP3AAhqCgk",
      "label": "Cacao en sistemas agroforestales"
    }
  },
  {
    "id": "mod-004",
    "number": 4,
    "title": "Módulo 04: Manejo de suelos — toma de decisiones",
    "category": "Manejo de suelos",
    "categoryKey": "Suelo",
    "duration_min": 10,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a manejo de suelos con énfasis en toma de decisiones. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de toma de decisiones en manejo de suelos.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "UI2_QX1au-w",
      "label": "Agricultura de bajo impacto y resiliente al clima"
    }
  },
  {
    "id": "mod-005",
    "number": 5,
    "title": "Módulo 05: Clima y riesgo — prevención temprana",
    "category": "Clima y riesgo",
    "categoryKey": "Clima",
    "duration_min": 13,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a clima y riesgo con énfasis en prevención temprana. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de prevención temprana en clima y riesgo.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "q6CISyF9TWs",
      "label": "Tutorial de fertilización NPK / fertirriego"
    }
  },
  {
    "id": "mod-006",
    "number": 6,
    "title": "Módulo 06: Cultivo de cacao — evaluación semanal",
    "category": "Cultivo de cacao",
    "categoryKey": "Cacao",
    "duration_min": 16,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a cultivo de cacao con énfasis en evaluación semanal. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de evaluación semanal en cultivo de cacao.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "8-eFCaOYof0",
      "label": "Diseño hidráulico y agronómico de riego tecnificado"
    }
  },
  {
    "id": "mod-007",
    "number": 7,
    "title": "Módulo 07: Cultivo de plátano — uso racional de insumos",
    "category": "Cultivo de plátano",
    "categoryKey": "Platano",
    "duration_min": 9,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a cultivo de plátano con énfasis en uso racional de insumos. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de uso racional de insumos en cultivo de plátano.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "dD0-rimvGL4",
      "label": "Doctores de los suelos · banano y plátano (FAO)"
    }
  },
  {
    "id": "mod-008",
    "number": 8,
    "title": "Módulo 08: Cultivo de maíz — trazabilidad básica",
    "category": "Cultivo de maíz",
    "categoryKey": "Maiz",
    "duration_min": 12,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a cultivo de maíz con énfasis en trazabilidad básica. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de trazabilidad básica en cultivo de maíz.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "AUSyu0BvgFw",
      "label": "Agricultura tropical 4.0 y agua · cacao (UTM Manabí)"
    }
  },
  {
    "id": "mod-009",
    "number": 9,
    "title": "Módulo 09: Cultivo de café — lectura de síntomas",
    "category": "Cultivo de café",
    "categoryKey": "Cafe",
    "duration_min": 15,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a cultivo de café con énfasis en lectura de síntomas. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de lectura de síntomas en cultivo de café.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "ucP3AAhqCgk",
      "label": "Cacao en sistemas agroforestales"
    }
  },
  {
    "id": "mod-010",
    "number": 10,
    "title": "Módulo 10: Manejo integrado — plan de seguimiento",
    "category": "Manejo integrado",
    "categoryKey": "MIP",
    "duration_min": 8,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a manejo integrado con énfasis en plan de seguimiento. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de plan de seguimiento en manejo integrado.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "UI2_QX1au-w",
      "label": "Agricultura de bajo impacto y resiliente al clima"
    }
  },
  {
    "id": "mod-011",
    "number": 11,
    "title": "Módulo 11: Nutrición vegetal — diagnóstico en campo",
    "category": "Nutrición vegetal",
    "categoryKey": "Nutricion",
    "duration_min": 11,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a nutrición vegetal con énfasis en diagnóstico en campo. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de diagnóstico en campo en nutrición vegetal.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "q6CISyF9TWs",
      "label": "Tutorial de fertilización NPK / fertirriego"
    }
  },
  {
    "id": "mod-012",
    "number": 12,
    "title": "Módulo 12: Riego y drenaje — muestreo representativo",
    "category": "Riego y drenaje",
    "categoryKey": "Agua",
    "duration_min": 14,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a riego y drenaje con énfasis en muestreo representativo. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de muestreo representativo en riego y drenaje.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "8-eFCaOYof0",
      "label": "Diseño hidráulico y agronómico de riego tecnificado"
    }
  },
  {
    "id": "mod-013",
    "number": 13,
    "title": "Módulo 13: Sanidad vegetal — registro del lote",
    "category": "Sanidad vegetal",
    "categoryKey": "Sanidad",
    "duration_min": 17,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a sanidad vegetal con énfasis en registro del lote. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de registro del lote en sanidad vegetal.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "dD0-rimvGL4",
      "label": "Doctores de los suelos · banano y plátano (FAO)"
    }
  },
  {
    "id": "mod-014",
    "number": 14,
    "title": "Módulo 14: Manejo de suelos — toma de decisiones",
    "category": "Manejo de suelos",
    "categoryKey": "Suelo",
    "duration_min": 10,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a manejo de suelos con énfasis en toma de decisiones. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de toma de decisiones en manejo de suelos.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "AUSyu0BvgFw",
      "label": "Agricultura tropical 4.0 y agua · cacao (UTM Manabí)"
    }
  },
  {
    "id": "mod-015",
    "number": 15,
    "title": "Módulo 15: Clima y riesgo — prevención temprana",
    "category": "Clima y riesgo",
    "categoryKey": "Clima",
    "duration_min": 13,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a clima y riesgo con énfasis en prevención temprana. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de prevención temprana en clima y riesgo.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "ucP3AAhqCgk",
      "label": "Cacao en sistemas agroforestales"
    }
  },
  {
    "id": "mod-016",
    "number": 16,
    "title": "Módulo 16: Cultivo de cacao — evaluación semanal",
    "category": "Cultivo de cacao",
    "categoryKey": "Cacao",
    "duration_min": 16,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a cultivo de cacao con énfasis en evaluación semanal. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de evaluación semanal en cultivo de cacao.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "UI2_QX1au-w",
      "label": "Agricultura de bajo impacto y resiliente al clima"
    }
  },
  {
    "id": "mod-017",
    "number": 17,
    "title": "Módulo 17: Cultivo de plátano — uso racional de insumos",
    "category": "Cultivo de plátano",
    "categoryKey": "Platano",
    "duration_min": 9,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a cultivo de plátano con énfasis en uso racional de insumos. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de uso racional de insumos en cultivo de plátano.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "q6CISyF9TWs",
      "label": "Tutorial de fertilización NPK / fertirriego"
    }
  },
  {
    "id": "mod-018",
    "number": 18,
    "title": "Módulo 18: Cultivo de maíz — trazabilidad básica",
    "category": "Cultivo de maíz",
    "categoryKey": "Maiz",
    "duration_min": 12,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a cultivo de maíz con énfasis en trazabilidad básica. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de trazabilidad básica en cultivo de maíz.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "8-eFCaOYof0",
      "label": "Diseño hidráulico y agronómico de riego tecnificado"
    }
  },
  {
    "id": "mod-019",
    "number": 19,
    "title": "Módulo 19: Cultivo de café — lectura de síntomas",
    "category": "Cultivo de café",
    "categoryKey": "Cafe",
    "duration_min": 15,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a cultivo de café con énfasis en lectura de síntomas. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de lectura de síntomas en cultivo de café.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "dD0-rimvGL4",
      "label": "Doctores de los suelos · banano y plátano (FAO)"
    }
  },
  {
    "id": "mod-020",
    "number": 20,
    "title": "Módulo 20: Manejo integrado — plan de seguimiento",
    "category": "Manejo integrado",
    "categoryKey": "MIP",
    "duration_min": 8,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a manejo integrado con énfasis en plan de seguimiento. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de plan de seguimiento en manejo integrado.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "AUSyu0BvgFw",
      "label": "Agricultura tropical 4.0 y agua · cacao (UTM Manabí)"
    }
  },
  {
    "id": "mod-021",
    "number": 21,
    "title": "Módulo 21: Nutrición vegetal — diagnóstico en campo",
    "category": "Nutrición vegetal",
    "categoryKey": "Nutricion",
    "duration_min": 11,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a nutrición vegetal con énfasis en diagnóstico en campo. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de diagnóstico en campo en nutrición vegetal.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "ucP3AAhqCgk",
      "label": "Cacao en sistemas agroforestales"
    }
  },
  {
    "id": "mod-022",
    "number": 22,
    "title": "Módulo 22: Riego y drenaje — muestreo representativo",
    "category": "Riego y drenaje",
    "categoryKey": "Agua",
    "duration_min": 14,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a riego y drenaje con énfasis en muestreo representativo. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de muestreo representativo en riego y drenaje.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "UI2_QX1au-w",
      "label": "Agricultura de bajo impacto y resiliente al clima"
    }
  },
  {
    "id": "mod-023",
    "number": 23,
    "title": "Módulo 23: Sanidad vegetal — registro del lote",
    "category": "Sanidad vegetal",
    "categoryKey": "Sanidad",
    "duration_min": 17,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a sanidad vegetal con énfasis en registro del lote. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de registro del lote en sanidad vegetal.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "q6CISyF9TWs",
      "label": "Tutorial de fertilización NPK / fertirriego"
    }
  },
  {
    "id": "mod-024",
    "number": 24,
    "title": "Módulo 24: Manejo de suelos — toma de decisiones",
    "category": "Manejo de suelos",
    "categoryKey": "Suelo",
    "duration_min": 10,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a manejo de suelos con énfasis en toma de decisiones. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de toma de decisiones en manejo de suelos.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "8-eFCaOYof0",
      "label": "Diseño hidráulico y agronómico de riego tecnificado"
    }
  },
  {
    "id": "mod-025",
    "number": 25,
    "title": "Módulo 25: Clima y riesgo — prevención temprana",
    "category": "Clima y riesgo",
    "categoryKey": "Clima",
    "duration_min": 13,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a clima y riesgo con énfasis en prevención temprana. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de prevención temprana en clima y riesgo.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "dD0-rimvGL4",
      "label": "Doctores de los suelos · banano y plátano (FAO)"
    }
  },
  {
    "id": "mod-026",
    "number": 26,
    "title": "Módulo 26: Cultivo de cacao — evaluación semanal",
    "category": "Cultivo de cacao",
    "categoryKey": "Cacao",
    "duration_min": 16,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a cultivo de cacao con énfasis en evaluación semanal. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de evaluación semanal en cultivo de cacao.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "AUSyu0BvgFw",
      "label": "Agricultura tropical 4.0 y agua · cacao (UTM Manabí)"
    }
  },
  {
    "id": "mod-027",
    "number": 27,
    "title": "Módulo 27: Cultivo de plátano — uso racional de insumos",
    "category": "Cultivo de plátano",
    "categoryKey": "Platano",
    "duration_min": 9,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a cultivo de plátano con énfasis en uso racional de insumos. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de uso racional de insumos en cultivo de plátano.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "ucP3AAhqCgk",
      "label": "Cacao en sistemas agroforestales"
    }
  },
  {
    "id": "mod-028",
    "number": 28,
    "title": "Módulo 28: Cultivo de maíz — trazabilidad básica",
    "category": "Cultivo de maíz",
    "categoryKey": "Maiz",
    "duration_min": 12,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a cultivo de maíz con énfasis en trazabilidad básica. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de trazabilidad básica en cultivo de maíz.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "UI2_QX1au-w",
      "label": "Agricultura de bajo impacto y resiliente al clima"
    }
  },
  {
    "id": "mod-029",
    "number": 29,
    "title": "Módulo 29: Cultivo de café — lectura de síntomas",
    "category": "Cultivo de café",
    "categoryKey": "Cafe",
    "duration_min": 15,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a cultivo de café con énfasis en lectura de síntomas. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de lectura de síntomas en cultivo de café.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "q6CISyF9TWs",
      "label": "Tutorial de fertilización NPK / fertirriego"
    }
  },
  {
    "id": "mod-030",
    "number": 30,
    "title": "Módulo 30: Manejo integrado — plan de seguimiento",
    "category": "Manejo integrado",
    "categoryKey": "MIP",
    "duration_min": 8,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a manejo integrado con énfasis en plan de seguimiento. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de plan de seguimiento en manejo integrado.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "8-eFCaOYof0",
      "label": "Diseño hidráulico y agronómico de riego tecnificado"
    }
  },
  {
    "id": "mod-031",
    "number": 31,
    "title": "Módulo 31: Nutrición vegetal — diagnóstico en campo",
    "category": "Nutrición vegetal",
    "categoryKey": "Nutricion",
    "duration_min": 11,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a nutrición vegetal con énfasis en diagnóstico en campo. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de diagnóstico en campo en nutrición vegetal.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "dD0-rimvGL4",
      "label": "Doctores de los suelos · banano y plátano (FAO)"
    }
  },
  {
    "id": "mod-032",
    "number": 32,
    "title": "Módulo 32: Riego y drenaje — muestreo representativo",
    "category": "Riego y drenaje",
    "categoryKey": "Agua",
    "duration_min": 14,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a riego y drenaje con énfasis en muestreo representativo. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de muestreo representativo en riego y drenaje.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "AUSyu0BvgFw",
      "label": "Agricultura tropical 4.0 y agua · cacao (UTM Manabí)"
    }
  },
  {
    "id": "mod-033",
    "number": 33,
    "title": "Módulo 33: Sanidad vegetal — registro del lote",
    "category": "Sanidad vegetal",
    "categoryKey": "Sanidad",
    "duration_min": 17,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a sanidad vegetal con énfasis en registro del lote. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de registro del lote en sanidad vegetal.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "ucP3AAhqCgk",
      "label": "Cacao en sistemas agroforestales"
    }
  },
  {
    "id": "mod-034",
    "number": 34,
    "title": "Módulo 34: Manejo de suelos — toma de decisiones",
    "category": "Manejo de suelos",
    "categoryKey": "Suelo",
    "duration_min": 10,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a manejo de suelos con énfasis en toma de decisiones. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de toma de decisiones en manejo de suelos.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "UI2_QX1au-w",
      "label": "Agricultura de bajo impacto y resiliente al clima"
    }
  },
  {
    "id": "mod-035",
    "number": 35,
    "title": "Módulo 35: Clima y riesgo — prevención temprana",
    "category": "Clima y riesgo",
    "categoryKey": "Clima",
    "duration_min": 13,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a clima y riesgo con énfasis en prevención temprana. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de prevención temprana en clima y riesgo.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "q6CISyF9TWs",
      "label": "Tutorial de fertilización NPK / fertirriego"
    }
  },
  {
    "id": "mod-036",
    "number": 36,
    "title": "Módulo 36: Cultivo de cacao — evaluación semanal",
    "category": "Cultivo de cacao",
    "categoryKey": "Cacao",
    "duration_min": 16,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a cultivo de cacao con énfasis en evaluación semanal. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de evaluación semanal en cultivo de cacao.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "8-eFCaOYof0",
      "label": "Diseño hidráulico y agronómico de riego tecnificado"
    }
  },
  {
    "id": "mod-037",
    "number": 37,
    "title": "Módulo 37: Cultivo de plátano — uso racional de insumos",
    "category": "Cultivo de plátano",
    "categoryKey": "Platano",
    "duration_min": 9,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a cultivo de plátano con énfasis en uso racional de insumos. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de uso racional de insumos en cultivo de plátano.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "dD0-rimvGL4",
      "label": "Doctores de los suelos · banano y plátano (FAO)"
    }
  },
  {
    "id": "mod-038",
    "number": 38,
    "title": "Módulo 38: Cultivo de maíz — trazabilidad básica",
    "category": "Cultivo de maíz",
    "categoryKey": "Maiz",
    "duration_min": 12,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a cultivo de maíz con énfasis en trazabilidad básica. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de trazabilidad básica en cultivo de maíz.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "AUSyu0BvgFw",
      "label": "Agricultura tropical 4.0 y agua · cacao (UTM Manabí)"
    }
  },
  {
    "id": "mod-039",
    "number": 39,
    "title": "Módulo 39: Cultivo de café — lectura de síntomas",
    "category": "Cultivo de café",
    "categoryKey": "Cafe",
    "duration_min": 15,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a cultivo de café con énfasis en lectura de síntomas. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de lectura de síntomas en cultivo de café.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "ucP3AAhqCgk",
      "label": "Cacao en sistemas agroforestales"
    }
  },
  {
    "id": "mod-040",
    "number": 40,
    "title": "Módulo 40: Manejo integrado — plan de seguimiento",
    "category": "Manejo integrado",
    "categoryKey": "MIP",
    "duration_min": 8,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a manejo integrado con énfasis en plan de seguimiento. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de plan de seguimiento en manejo integrado.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "UI2_QX1au-w",
      "label": "Agricultura de bajo impacto y resiliente al clima"
    }
  },
  {
    "id": "mod-041",
    "number": 41,
    "title": "Módulo 41: Nutrición vegetal — diagnóstico en campo",
    "category": "Nutrición vegetal",
    "categoryKey": "Nutricion",
    "duration_min": 11,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a nutrición vegetal con énfasis en diagnóstico en campo. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de diagnóstico en campo en nutrición vegetal.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "q6CISyF9TWs",
      "label": "Tutorial de fertilización NPK / fertirriego"
    }
  },
  {
    "id": "mod-042",
    "number": 42,
    "title": "Módulo 42: Riego y drenaje — muestreo representativo",
    "category": "Riego y drenaje",
    "categoryKey": "Agua",
    "duration_min": 14,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a riego y drenaje con énfasis en muestreo representativo. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de muestreo representativo en riego y drenaje.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "8-eFCaOYof0",
      "label": "Diseño hidráulico y agronómico de riego tecnificado"
    }
  },
  {
    "id": "mod-043",
    "number": 43,
    "title": "Módulo 43: Sanidad vegetal — registro del lote",
    "category": "Sanidad vegetal",
    "categoryKey": "Sanidad",
    "duration_min": 17,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a sanidad vegetal con énfasis en registro del lote. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de registro del lote en sanidad vegetal.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "dD0-rimvGL4",
      "label": "Doctores de los suelos · banano y plátano (FAO)"
    }
  },
  {
    "id": "mod-044",
    "number": 44,
    "title": "Módulo 44: Manejo de suelos — toma de decisiones",
    "category": "Manejo de suelos",
    "categoryKey": "Suelo",
    "duration_min": 10,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a manejo de suelos con énfasis en toma de decisiones. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de toma de decisiones en manejo de suelos.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "AUSyu0BvgFw",
      "label": "Agricultura tropical 4.0 y agua · cacao (UTM Manabí)"
    }
  },
  {
    "id": "mod-045",
    "number": 45,
    "title": "Módulo 45: Clima y riesgo — prevención temprana",
    "category": "Clima y riesgo",
    "categoryKey": "Clima",
    "duration_min": 13,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a clima y riesgo con énfasis en prevención temprana. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de prevención temprana en clima y riesgo.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "ucP3AAhqCgk",
      "label": "Cacao en sistemas agroforestales"
    }
  },
  {
    "id": "mod-046",
    "number": 46,
    "title": "Módulo 46: Cultivo de cacao — evaluación semanal",
    "category": "Cultivo de cacao",
    "categoryKey": "Cacao",
    "duration_min": 16,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a cultivo de cacao con énfasis en evaluación semanal. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de evaluación semanal en cultivo de cacao.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "UI2_QX1au-w",
      "label": "Agricultura de bajo impacto y resiliente al clima"
    }
  },
  {
    "id": "mod-047",
    "number": 47,
    "title": "Módulo 47: Cultivo de plátano — uso racional de insumos",
    "category": "Cultivo de plátano",
    "categoryKey": "Platano",
    "duration_min": 9,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a cultivo de plátano con énfasis en uso racional de insumos. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de uso racional de insumos en cultivo de plátano.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "q6CISyF9TWs",
      "label": "Tutorial de fertilización NPK / fertirriego"
    }
  },
  {
    "id": "mod-048",
    "number": 48,
    "title": "Módulo 48: Cultivo de maíz — trazabilidad básica",
    "category": "Cultivo de maíz",
    "categoryKey": "Maiz",
    "duration_min": 12,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a cultivo de maíz con énfasis en trazabilidad básica. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de trazabilidad básica en cultivo de maíz.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "8-eFCaOYof0",
      "label": "Diseño hidráulico y agronómico de riego tecnificado"
    }
  },
  {
    "id": "mod-049",
    "number": 49,
    "title": "Módulo 49: Cultivo de café — lectura de síntomas",
    "category": "Cultivo de café",
    "categoryKey": "Cafe",
    "duration_min": 15,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a cultivo de café con énfasis en lectura de síntomas. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de lectura de síntomas en cultivo de café.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "dD0-rimvGL4",
      "label": "Doctores de los suelos · banano y plátano (FAO)"
    }
  },
  {
    "id": "mod-050",
    "number": 50,
    "title": "Módulo 50: Manejo integrado — plan de seguimiento",
    "category": "Manejo integrado",
    "categoryKey": "MIP",
    "duration_min": 8,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a manejo integrado con énfasis en plan de seguimiento. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de plan de seguimiento en manejo integrado.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "AUSyu0BvgFw",
      "label": "Agricultura tropical 4.0 y agua · cacao (UTM Manabí)"
    }
  },
  {
    "id": "mod-051",
    "number": 51,
    "title": "Módulo 51: Nutrición vegetal — diagnóstico en campo",
    "category": "Nutrición vegetal",
    "categoryKey": "Nutricion",
    "duration_min": 11,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a nutrición vegetal con énfasis en diagnóstico en campo. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de diagnóstico en campo en nutrición vegetal.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "ucP3AAhqCgk",
      "label": "Cacao en sistemas agroforestales"
    }
  },
  {
    "id": "mod-052",
    "number": 52,
    "title": "Módulo 52: Riego y drenaje — muestreo representativo",
    "category": "Riego y drenaje",
    "categoryKey": "Agua",
    "duration_min": 14,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a riego y drenaje con énfasis en muestreo representativo. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de muestreo representativo en riego y drenaje.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "UI2_QX1au-w",
      "label": "Agricultura de bajo impacto y resiliente al clima"
    }
  },
  {
    "id": "mod-053",
    "number": 53,
    "title": "Módulo 53: Sanidad vegetal — registro del lote",
    "category": "Sanidad vegetal",
    "categoryKey": "Sanidad",
    "duration_min": 17,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a sanidad vegetal con énfasis en registro del lote. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de registro del lote en sanidad vegetal.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "q6CISyF9TWs",
      "label": "Tutorial de fertilización NPK / fertirriego"
    }
  },
  {
    "id": "mod-054",
    "number": 54,
    "title": "Módulo 54: Manejo de suelos — toma de decisiones",
    "category": "Manejo de suelos",
    "categoryKey": "Suelo",
    "duration_min": 10,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a manejo de suelos con énfasis en toma de decisiones. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de toma de decisiones en manejo de suelos.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "8-eFCaOYof0",
      "label": "Diseño hidráulico y agronómico de riego tecnificado"
    }
  },
  {
    "id": "mod-055",
    "number": 55,
    "title": "Módulo 55: Clima y riesgo — prevención temprana",
    "category": "Clima y riesgo",
    "categoryKey": "Clima",
    "duration_min": 13,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a clima y riesgo con énfasis en prevención temprana. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de prevención temprana en clima y riesgo.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "dD0-rimvGL4",
      "label": "Doctores de los suelos · banano y plátano (FAO)"
    }
  },
  {
    "id": "mod-056",
    "number": 56,
    "title": "Módulo 56: Cultivo de cacao — evaluación semanal",
    "category": "Cultivo de cacao",
    "categoryKey": "Cacao",
    "duration_min": 16,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a cultivo de cacao con énfasis en evaluación semanal. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de evaluación semanal en cultivo de cacao.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "AUSyu0BvgFw",
      "label": "Agricultura tropical 4.0 y agua · cacao (UTM Manabí)"
    }
  },
  {
    "id": "mod-057",
    "number": 57,
    "title": "Módulo 57: Cultivo de plátano — uso racional de insumos",
    "category": "Cultivo de plátano",
    "categoryKey": "Platano",
    "duration_min": 9,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a cultivo de plátano con énfasis en uso racional de insumos. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de uso racional de insumos en cultivo de plátano.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "ucP3AAhqCgk",
      "label": "Cacao en sistemas agroforestales"
    }
  },
  {
    "id": "mod-058",
    "number": 58,
    "title": "Módulo 58: Cultivo de maíz — trazabilidad básica",
    "category": "Cultivo de maíz",
    "categoryKey": "Maiz",
    "duration_min": 12,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a cultivo de maíz con énfasis en trazabilidad básica. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de trazabilidad básica en cultivo de maíz.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "UI2_QX1au-w",
      "label": "Agricultura de bajo impacto y resiliente al clima"
    }
  },
  {
    "id": "mod-059",
    "number": 59,
    "title": "Módulo 59: Cultivo de café — lectura de síntomas",
    "category": "Cultivo de café",
    "categoryKey": "Cafe",
    "duration_min": 15,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a cultivo de café con énfasis en lectura de síntomas. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de lectura de síntomas en cultivo de café.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "q6CISyF9TWs",
      "label": "Tutorial de fertilización NPK / fertirriego"
    }
  },
  {
    "id": "mod-060",
    "number": 60,
    "title": "Módulo 60: Manejo integrado — plan de seguimiento",
    "category": "Manejo integrado",
    "categoryKey": "MIP",
    "duration_min": 8,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a manejo integrado con énfasis en plan de seguimiento. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de plan de seguimiento en manejo integrado.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "8-eFCaOYof0",
      "label": "Diseño hidráulico y agronómico de riego tecnificado"
    }
  },
  {
    "id": "mod-061",
    "number": 61,
    "title": "Módulo 61: Nutrición vegetal — diagnóstico en campo",
    "category": "Nutrición vegetal",
    "categoryKey": "Nutricion",
    "duration_min": 11,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a nutrición vegetal con énfasis en diagnóstico en campo. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de diagnóstico en campo en nutrición vegetal.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "dD0-rimvGL4",
      "label": "Doctores de los suelos · banano y plátano (FAO)"
    }
  },
  {
    "id": "mod-062",
    "number": 62,
    "title": "Módulo 62: Riego y drenaje — muestreo representativo",
    "category": "Riego y drenaje",
    "categoryKey": "Agua",
    "duration_min": 14,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a riego y drenaje con énfasis en muestreo representativo. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de muestreo representativo en riego y drenaje.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "AUSyu0BvgFw",
      "label": "Agricultura tropical 4.0 y agua · cacao (UTM Manabí)"
    }
  },
  {
    "id": "mod-063",
    "number": 63,
    "title": "Módulo 63: Sanidad vegetal — registro del lote",
    "category": "Sanidad vegetal",
    "categoryKey": "Sanidad",
    "duration_min": 17,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a sanidad vegetal con énfasis en registro del lote. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de registro del lote en sanidad vegetal.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "ucP3AAhqCgk",
      "label": "Cacao en sistemas agroforestales"
    }
  },
  {
    "id": "mod-064",
    "number": 64,
    "title": "Módulo 64: Manejo de suelos — toma de decisiones",
    "category": "Manejo de suelos",
    "categoryKey": "Suelo",
    "duration_min": 10,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a manejo de suelos con énfasis en toma de decisiones. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de toma de decisiones en manejo de suelos.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "UI2_QX1au-w",
      "label": "Agricultura de bajo impacto y resiliente al clima"
    }
  },
  {
    "id": "mod-065",
    "number": 65,
    "title": "Módulo 65: Clima y riesgo — prevención temprana",
    "category": "Clima y riesgo",
    "categoryKey": "Clima",
    "duration_min": 13,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a clima y riesgo con énfasis en prevención temprana. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de prevención temprana en clima y riesgo.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "q6CISyF9TWs",
      "label": "Tutorial de fertilización NPK / fertirriego"
    }
  },
  {
    "id": "mod-066",
    "number": 66,
    "title": "Módulo 66: Cultivo de cacao — evaluación semanal",
    "category": "Cultivo de cacao",
    "categoryKey": "Cacao",
    "duration_min": 16,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a cultivo de cacao con énfasis en evaluación semanal. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de evaluación semanal en cultivo de cacao.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "8-eFCaOYof0",
      "label": "Diseño hidráulico y agronómico de riego tecnificado"
    }
  },
  {
    "id": "mod-067",
    "number": 67,
    "title": "Módulo 67: Cultivo de plátano — uso racional de insumos",
    "category": "Cultivo de plátano",
    "categoryKey": "Platano",
    "duration_min": 9,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a cultivo de plátano con énfasis en uso racional de insumos. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de uso racional de insumos en cultivo de plátano.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "dD0-rimvGL4",
      "label": "Doctores de los suelos · banano y plátano (FAO)"
    }
  },
  {
    "id": "mod-068",
    "number": 68,
    "title": "Módulo 68: Cultivo de maíz — trazabilidad básica",
    "category": "Cultivo de maíz",
    "categoryKey": "Maiz",
    "duration_min": 12,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a cultivo de maíz con énfasis en trazabilidad básica. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de trazabilidad básica en cultivo de maíz.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "AUSyu0BvgFw",
      "label": "Agricultura tropical 4.0 y agua · cacao (UTM Manabí)"
    }
  },
  {
    "id": "mod-069",
    "number": 69,
    "title": "Módulo 69: Cultivo de café — lectura de síntomas",
    "category": "Cultivo de café",
    "categoryKey": "Cafe",
    "duration_min": 15,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a cultivo de café con énfasis en lectura de síntomas. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de lectura de síntomas en cultivo de café.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "ucP3AAhqCgk",
      "label": "Cacao en sistemas agroforestales"
    }
  },
  {
    "id": "mod-070",
    "number": 70,
    "title": "Módulo 70: Manejo integrado — plan de seguimiento",
    "category": "Manejo integrado",
    "categoryKey": "MIP",
    "duration_min": 8,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a manejo integrado con énfasis en plan de seguimiento. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de plan de seguimiento en manejo integrado.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "UI2_QX1au-w",
      "label": "Agricultura de bajo impacto y resiliente al clima"
    }
  },
  {
    "id": "mod-071",
    "number": 71,
    "title": "Módulo 71: Nutrición vegetal — diagnóstico en campo",
    "category": "Nutrición vegetal",
    "categoryKey": "Nutricion",
    "duration_min": 11,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a nutrición vegetal con énfasis en diagnóstico en campo. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de diagnóstico en campo en nutrición vegetal.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "q6CISyF9TWs",
      "label": "Tutorial de fertilización NPK / fertirriego"
    }
  },
  {
    "id": "mod-072",
    "number": 72,
    "title": "Módulo 72: Riego y drenaje — muestreo representativo",
    "category": "Riego y drenaje",
    "categoryKey": "Agua",
    "duration_min": 14,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a riego y drenaje con énfasis en muestreo representativo. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de muestreo representativo en riego y drenaje.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "8-eFCaOYof0",
      "label": "Diseño hidráulico y agronómico de riego tecnificado"
    }
  },
  {
    "id": "mod-073",
    "number": 73,
    "title": "Módulo 73: Sanidad vegetal — registro del lote",
    "category": "Sanidad vegetal",
    "categoryKey": "Sanidad",
    "duration_min": 17,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a sanidad vegetal con énfasis en registro del lote. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de registro del lote en sanidad vegetal.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "dD0-rimvGL4",
      "label": "Doctores de los suelos · banano y plátano (FAO)"
    }
  },
  {
    "id": "mod-074",
    "number": 74,
    "title": "Módulo 74: Manejo de suelos — toma de decisiones",
    "category": "Manejo de suelos",
    "categoryKey": "Suelo",
    "duration_min": 10,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a manejo de suelos con énfasis en toma de decisiones. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de toma de decisiones en manejo de suelos.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "AUSyu0BvgFw",
      "label": "Agricultura tropical 4.0 y agua · cacao (UTM Manabí)"
    }
  },
  {
    "id": "mod-075",
    "number": 75,
    "title": "Módulo 75: Clima y riesgo — prevención temprana",
    "category": "Clima y riesgo",
    "categoryKey": "Clima",
    "duration_min": 13,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a clima y riesgo con énfasis en prevención temprana. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de prevención temprana en clima y riesgo.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "ucP3AAhqCgk",
      "label": "Cacao en sistemas agroforestales"
    }
  },
  {
    "id": "mod-076",
    "number": 76,
    "title": "Módulo 76: Cultivo de cacao — evaluación semanal",
    "category": "Cultivo de cacao",
    "categoryKey": "Cacao",
    "duration_min": 16,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a cultivo de cacao con énfasis en evaluación semanal. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de evaluación semanal en cultivo de cacao.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "UI2_QX1au-w",
      "label": "Agricultura de bajo impacto y resiliente al clima"
    }
  },
  {
    "id": "mod-077",
    "number": 77,
    "title": "Módulo 77: Cultivo de plátano — uso racional de insumos",
    "category": "Cultivo de plátano",
    "categoryKey": "Platano",
    "duration_min": 9,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a cultivo de plátano con énfasis en uso racional de insumos. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de uso racional de insumos en cultivo de plátano.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "q6CISyF9TWs",
      "label": "Tutorial de fertilización NPK / fertirriego"
    }
  },
  {
    "id": "mod-078",
    "number": 78,
    "title": "Módulo 78: Cultivo de maíz — trazabilidad básica",
    "category": "Cultivo de maíz",
    "categoryKey": "Maiz",
    "duration_min": 12,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a cultivo de maíz con énfasis en trazabilidad básica. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de trazabilidad básica en cultivo de maíz.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "8-eFCaOYof0",
      "label": "Diseño hidráulico y agronómico de riego tecnificado"
    }
  },
  {
    "id": "mod-079",
    "number": 79,
    "title": "Módulo 79: Cultivo de café — lectura de síntomas",
    "category": "Cultivo de café",
    "categoryKey": "Cafe",
    "duration_min": 15,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a cultivo de café con énfasis en lectura de síntomas. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de lectura de síntomas en cultivo de café.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "dD0-rimvGL4",
      "label": "Doctores de los suelos · banano y plátano (FAO)"
    }
  },
  {
    "id": "mod-080",
    "number": 80,
    "title": "Módulo 80: Manejo integrado — plan de seguimiento",
    "category": "Manejo integrado",
    "categoryKey": "MIP",
    "duration_min": 8,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a manejo integrado con énfasis en plan de seguimiento. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de plan de seguimiento en manejo integrado.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "AUSyu0BvgFw",
      "label": "Agricultura tropical 4.0 y agua · cacao (UTM Manabí)"
    }
  },
  {
    "id": "mod-081",
    "number": 81,
    "title": "Módulo 81: Nutrición vegetal — diagnóstico en campo",
    "category": "Nutrición vegetal",
    "categoryKey": "Nutricion",
    "duration_min": 11,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a nutrición vegetal con énfasis en diagnóstico en campo. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de diagnóstico en campo en nutrición vegetal.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "ucP3AAhqCgk",
      "label": "Cacao en sistemas agroforestales"
    }
  },
  {
    "id": "mod-082",
    "number": 82,
    "title": "Módulo 82: Riego y drenaje — muestreo representativo",
    "category": "Riego y drenaje",
    "categoryKey": "Agua",
    "duration_min": 14,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a riego y drenaje con énfasis en muestreo representativo. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de muestreo representativo en riego y drenaje.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "UI2_QX1au-w",
      "label": "Agricultura de bajo impacto y resiliente al clima"
    }
  },
  {
    "id": "mod-083",
    "number": 83,
    "title": "Módulo 83: Sanidad vegetal — registro del lote",
    "category": "Sanidad vegetal",
    "categoryKey": "Sanidad",
    "duration_min": 17,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a sanidad vegetal con énfasis en registro del lote. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de registro del lote en sanidad vegetal.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "q6CISyF9TWs",
      "label": "Tutorial de fertilización NPK / fertirriego"
    }
  },
  {
    "id": "mod-084",
    "number": 84,
    "title": "Módulo 84: Manejo de suelos — toma de decisiones",
    "category": "Manejo de suelos",
    "categoryKey": "Suelo",
    "duration_min": 10,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a manejo de suelos con énfasis en toma de decisiones. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de toma de decisiones en manejo de suelos.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "8-eFCaOYof0",
      "label": "Diseño hidráulico y agronómico de riego tecnificado"
    }
  },
  {
    "id": "mod-085",
    "number": 85,
    "title": "Módulo 85: Clima y riesgo — prevención temprana",
    "category": "Clima y riesgo",
    "categoryKey": "Clima",
    "duration_min": 13,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a clima y riesgo con énfasis en prevención temprana. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de prevención temprana en clima y riesgo.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "dD0-rimvGL4",
      "label": "Doctores de los suelos · banano y plátano (FAO)"
    }
  },
  {
    "id": "mod-086",
    "number": 86,
    "title": "Módulo 86: Cultivo de cacao — evaluación semanal",
    "category": "Cultivo de cacao",
    "categoryKey": "Cacao",
    "duration_min": 16,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a cultivo de cacao con énfasis en evaluación semanal. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de evaluación semanal en cultivo de cacao.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "AUSyu0BvgFw",
      "label": "Agricultura tropical 4.0 y agua · cacao (UTM Manabí)"
    }
  },
  {
    "id": "mod-087",
    "number": 87,
    "title": "Módulo 87: Cultivo de plátano — uso racional de insumos",
    "category": "Cultivo de plátano",
    "categoryKey": "Platano",
    "duration_min": 9,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a cultivo de plátano con énfasis en uso racional de insumos. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de uso racional de insumos en cultivo de plátano.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "ucP3AAhqCgk",
      "label": "Cacao en sistemas agroforestales"
    }
  },
  {
    "id": "mod-088",
    "number": 88,
    "title": "Módulo 88: Cultivo de maíz — trazabilidad básica",
    "category": "Cultivo de maíz",
    "categoryKey": "Maiz",
    "duration_min": 12,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a cultivo de maíz con énfasis en trazabilidad básica. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de trazabilidad básica en cultivo de maíz.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "UI2_QX1au-w",
      "label": "Agricultura de bajo impacto y resiliente al clima"
    }
  },
  {
    "id": "mod-089",
    "number": 89,
    "title": "Módulo 89: Cultivo de café — lectura de síntomas",
    "category": "Cultivo de café",
    "categoryKey": "Cafe",
    "duration_min": 15,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a cultivo de café con énfasis en lectura de síntomas. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de lectura de síntomas en cultivo de café.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "q6CISyF9TWs",
      "label": "Tutorial de fertilización NPK / fertirriego"
    }
  },
  {
    "id": "mod-090",
    "number": 90,
    "title": "Módulo 90: Manejo integrado — plan de seguimiento",
    "category": "Manejo integrado",
    "categoryKey": "MIP",
    "duration_min": 8,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a manejo integrado con énfasis en plan de seguimiento. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de plan de seguimiento en manejo integrado.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "8-eFCaOYof0",
      "label": "Diseño hidráulico y agronómico de riego tecnificado"
    }
  },
  {
    "id": "mod-091",
    "number": 91,
    "title": "Módulo 91: Nutrición vegetal — diagnóstico en campo",
    "category": "Nutrición vegetal",
    "categoryKey": "Nutricion",
    "duration_min": 11,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a nutrición vegetal con énfasis en diagnóstico en campo. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de diagnóstico en campo en nutrición vegetal.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "dD0-rimvGL4",
      "label": "Doctores de los suelos · banano y plátano (FAO)"
    }
  },
  {
    "id": "mod-092",
    "number": 92,
    "title": "Módulo 92: Riego y drenaje — muestreo representativo",
    "category": "Riego y drenaje",
    "categoryKey": "Agua",
    "duration_min": 14,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a riego y drenaje con énfasis en muestreo representativo. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de muestreo representativo en riego y drenaje.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "AUSyu0BvgFw",
      "label": "Agricultura tropical 4.0 y agua · cacao (UTM Manabí)"
    }
  },
  {
    "id": "mod-093",
    "number": 93,
    "title": "Módulo 93: Sanidad vegetal — registro del lote",
    "category": "Sanidad vegetal",
    "categoryKey": "Sanidad",
    "duration_min": 17,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a sanidad vegetal con énfasis en registro del lote. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de registro del lote en sanidad vegetal.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "ucP3AAhqCgk",
      "label": "Cacao en sistemas agroforestales"
    }
  },
  {
    "id": "mod-094",
    "number": 94,
    "title": "Módulo 94: Manejo de suelos — toma de decisiones",
    "category": "Manejo de suelos",
    "categoryKey": "Suelo",
    "duration_min": 10,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a manejo de suelos con énfasis en toma de decisiones. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de toma de decisiones en manejo de suelos.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "UI2_QX1au-w",
      "label": "Agricultura de bajo impacto y resiliente al clima"
    }
  },
  {
    "id": "mod-095",
    "number": 95,
    "title": "Módulo 95: Clima y riesgo — prevención temprana",
    "category": "Clima y riesgo",
    "categoryKey": "Clima",
    "duration_min": 13,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a clima y riesgo con énfasis en prevención temprana. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de prevención temprana en clima y riesgo.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "q6CISyF9TWs",
      "label": "Tutorial de fertilización NPK / fertirriego"
    }
  },
  {
    "id": "mod-096",
    "number": 96,
    "title": "Módulo 96: Cultivo de cacao — evaluación semanal",
    "category": "Cultivo de cacao",
    "categoryKey": "Cacao",
    "duration_min": 16,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a cultivo de cacao con énfasis en evaluación semanal. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de evaluación semanal en cultivo de cacao.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "8-eFCaOYof0",
      "label": "Diseño hidráulico y agronómico de riego tecnificado"
    }
  },
  {
    "id": "mod-097",
    "number": 97,
    "title": "Módulo 97: Cultivo de plátano — uso racional de insumos",
    "category": "Cultivo de plátano",
    "categoryKey": "Platano",
    "duration_min": 9,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a cultivo de plátano con énfasis en uso racional de insumos. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de uso racional de insumos en cultivo de plátano.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "dD0-rimvGL4",
      "label": "Doctores de los suelos · banano y plátano (FAO)"
    }
  },
  {
    "id": "mod-098",
    "number": 98,
    "title": "Módulo 98: Cultivo de maíz — trazabilidad básica",
    "category": "Cultivo de maíz",
    "categoryKey": "Maiz",
    "duration_min": 12,
    "level": "Intermedio",
    "summary": "Capacitación agronómica aplicada a cultivo de maíz con énfasis en trazabilidad básica. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de trazabilidad básica en cultivo de maíz.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "AUSyu0BvgFw",
      "label": "Agricultura tropical 4.0 y agua · cacao (UTM Manabí)"
    }
  },
  {
    "id": "mod-099",
    "number": 99,
    "title": "Módulo 99: Cultivo de café — lectura de síntomas",
    "category": "Cultivo de café",
    "categoryKey": "Cafe",
    "duration_min": 15,
    "level": "Avanzado",
    "summary": "Capacitación agronómica aplicada a cultivo de café con énfasis en lectura de síntomas. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de lectura de síntomas en cultivo de café.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "ucP3AAhqCgk",
      "label": "Cacao en sistemas agroforestales"
    }
  },
  {
    "id": "mod-100",
    "number": 100,
    "title": "Módulo 100: Manejo integrado — plan de seguimiento",
    "category": "Manejo integrado",
    "categoryKey": "MIP",
    "duration_min": 8,
    "level": "Básico",
    "summary": "Capacitación agronómica aplicada a manejo integrado con énfasis en plan de seguimiento. Orientada a productores de Manabí y la costa ecuatoriana.",
    "objectives": [
      "Comprender el concepto clave de plan de seguimiento en manejo integrado.",
      "Aplicar el procedimiento en un lote real o de práctica.",
      "Registrar evidencias (foto, notas o checklist) para seguimiento."
    ],
    "steps": [
      "Identifica el problema y anota el lote afectado.",
      "Observa síntomas o condiciones en al menos 10 plantas del área.",
      "Revisa humedad, drenaje y sombra del microclima.",
      "Aplica primero la práctica cultural recomendada antes de químicos.",
      "Documenta fecha, labor, dosis o evidencia fotográfica.",
      "Evalúa el resultado a los 3–7 días y ajusta el plan del lote."
    ],
    "video": {
      "youtubeId": "UI2_QX1au-w",
      "label": "Agricultura de bajo impacto y resiliente al clima"
    }
  }
];

export const CAPACITACION_CATEGORIES = Array.from(
  new Set(CAPACITACION_MODULES.map((m) => m.category))
);
