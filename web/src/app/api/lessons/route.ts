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
  {
    id: "local-escoba-bruja",
    slug: "escoba-de-bruja-cacao",
    title: "Escoba de bruja del cacao",
    crop: "Cacao",
    infection_type: "Hongo",
    disease_keywords: ["escoba", "bruja", "moniliophthora", "perniciosa"],
    duration_min: 5,
    image_src: "/samples/cacao-monilia.jpg",
    image_alt: "Referencia de cacao con brotes deformados",
    symptoms: [
      "Brotes vegetativos hiperdesarrollados",
      "Flores y cojines florales deformados",
      "Mazorcas irregulares o momificadas",
    ],
    description:
      "La escoba de bruja, causada por Moniliophthora perniciosa, induce brotes vegetativos anormales (escobas), deforma cojines florales y puede afectar frutos. Reduce la producción a mediano plazo y se favorece con sombra densa, alta humedad y material vegetativo infectado no saneado.",
    prevention_steps: [
      "Podar y retirar escobas verdes y secas; sacar el material del lote.",
      "Sanear cojines florales deformados en épocas de floración intensa.",
      "Regular sombra para mejorar aireación y secar más rápido el dosel.",
      "Desinfectar tijeras y machetes entre árboles.",
      "Evitar trasladar yemas o plantas de zonas con alta incidencia.",
      "Monitorear mensualmente el número de escobas por árbol en focos conocidos.",
    ],
    content_md: "",
  },
  {
    id: "local-phytophthora-cacao",
    slug: "phytophthora-mazorca-cacao",
    title: "Phytophthora (mazorca negra) del cacao",
    crop: "Cacao",
    infection_type: "Hongo",
    disease_keywords: ["phytophthora", "mazorca negra", "pudricion", "cacao"],
    duration_min: 5,
    image_src: "/samples/cacao-monilia.jpg",
    image_alt: "Mazorca de cacao con pudrición oscura",
    symptoms: [
      "Mancha café-negra que avanza rápido",
      "Pudrición interna de la mazorca",
      "Esporulación blanca o gris en superficie",
    ],
    description:
      "Phytophthora palmivora y especies afines provocan la mazorca negra del cacao: lesiones oscuras que avanzan con rapidez bajo lluvia y salpicadura de suelo. Puede pudrir el fruto completo en pocos días. Se confunde a veces con monilia, pero suele progresar más rápido en época muy lluviosa y en frutos bajos.",
    prevention_steps: [
      "Cosechar con frecuencia y retirar frutos enfermos del árbol y del suelo.",
      "Elevar o proteger frutos muy bajos del contacto con salpicadura de suelo.",
      "Mejorar drenaje y reducir encharcamientos bajo la plantación.",
      "Regular sombra excesiva en periodos de lluvia continua.",
      "Aplicar fungicidas a base de cobre u otros autorizados según etiqueta cuando el riesgo sea alto.",
      "Comparar focos con monilia para no confundir el manejo.",
    ],
    content_md: "",
  },
  {
    id: "local-moko",
    slug: "moko-bacteriano-platano",
    title: "Moko bacteriano del plátano",
    crop: "Plátano / Banano",
    infection_type: "Bacteria",
    disease_keywords: ["moko", "ralstonia", "bacteriano", "marchitez"],
    duration_min: 6,
    image_src: "/samples/sigatoka.jpg",
    image_alt: "Referencia de marchitez en plátano",
    symptoms: [
      "Amarillamiento y marchitez rápida",
      "Racimo deformado o prematuro",
      "Exudado bacteriano en cortes",
    ],
    description:
      "El moko, causado por Ralstonia solanacearum (raza 2), es una marchitez bacteriana de alto impacto en musáceas. Se transmite por herramientas, insectos, agua y material de siembra. Produce marchitez, amarillamiento, necrosis vascular y a menudo exudado bacteriano al cortar. Requiere aislamiento estricto del foco.",
    prevention_steps: [
      "Usar semilla o cormos certificados y de origen controlado.",
      "Desinfectar herramientas y calzado al entrar y salir del lote.",
      "Aislar y marcar plantas sospechosas; no mover residuos a lotes sanos.",
      "Controlar malezas hospederas alrededor del cultivo.",
      "Evitar riego que disperse agua desde focos hacia zonas sanas.",
      "Notificar de inmediato a asistencia técnica MAG ante sospecha.",
    ],
    content_md: "",
  },
  {
    id: "local-picudo",
    slug: "picudo-negro-platano",
    title: "Picudo negro del plátano",
    crop: "Plátano / Banano",
    infection_type: "Plaga",
    disease_keywords: ["picudo", "cosmopolites", "taladro", "cormo"],
    duration_min: 5,
    image_src: "/samples/sigatoka.jpg",
    image_alt: "Referencia de daño en base de plátano",
    symptoms: [
      "Galerías en el cormo",
      "Plantas inclinadas o volcadas",
      "Adultos negros cerca de la base",
    ],
    description:
      "El picudo negro (Cosmopolites sordidus) taladra el cormo y debilita el anclaje de la planta. Las larvas abren galerías que favorecen pudriciones y volcamiento. La presión aumenta con residuos de cosecha, plantaciones viejas y control deficiente de maleza en la base.",
    prevention_steps: [
      "Retirar residuos de cosecha y pseudotallos viejos del suelo.",
      "Usar trampas con feromona o trozos de cormo para monitoreo.",
      "Seleccionar material de siembra limpio, sin galerías visibles.",
      "Mantener la base de la planta libre de maleza densa.",
      "Aplicar control biológico o químico autorizado solo si el umbral lo justifica.",
      "Registrar capturas semanales para detectar picos de población.",
    ],
    content_md: "",
  },
  {
    id: "local-bsv",
    slug: "virus-rayado-banano",
    title: "Virus del rayado del banano (BSV)",
    crop: "Plátano / Banano",
    infection_type: "Virus",
    disease_keywords: ["virus", "bsv", "rayado", "banano", "mosaico"],
    duration_min: 5,
    image_src: "/samples/sigatoka.jpg",
    image_alt: "Referencia de rayado clorótico en hoja de plátano",
    symptoms: [
      "Rayas cloróticas en la hoja",
      "Deformación foliar",
      "Plantas achaparradas",
    ],
    description:
      "El Banana streak virus (BSV) produce rayado clorótico, mosaico y a veces deformación foliar. Se transmite principalmente por material vegetativo infectado y, en algunos casos, por insectos vectores. No tiene cura química: el manejo se basa en prevención, eliminación de plantas afectadas y uso de semilla limpia.",
    prevention_steps: [
      "Sembrar únicamente material in vitro o cormos de origen confiable.",
      "Eliminar plantas con síntomas claros y no usarlas como semilla.",
      "Controlar insectos vectores según monitoreo local.",
      "No mezclar herramientas entre lotes sanos y sospechosos sin desinfección.",
      "Registrar focos y evitar propagar hijos de plantas sintomáticas.",
      "Consultar diagnóstico de laboratorio ante duda con otras virosis.",
    ],
    content_md: "",
  },
  {
    id: "local-antracnosis-platano",
    slug: "antracnosis-platano",
    title: "Antracnosis del plátano",
    crop: "Plátano / Banano",
    infection_type: "Hongo",
    disease_keywords: ["antracnosis", "colletotrichum", "platano", "postcosecha"],
    duration_min: 4,
    image_src: "/samples/sigatoka.jpg",
    image_alt: "Referencia de manchas en fruto de plátano",
    symptoms: [
      "Manchas negras hundidas en fruto",
      "Lesiones en pedúnculo",
      "Pudrición en poscosecha",
    ],
    description:
      "La antracnosis (Colletotrichum spp.) afecta frutos y pedúnculos, con manchas oscuras hundidas que se agravan en poscosecha bajo humedad. Heridas de cosecha, lavado deficiente y temperaturas altas aceleran el daño comercial del racimo.",
    prevention_steps: [
      "Cosechar con cuidado evitando golpes y heridas en la cáscara.",
      "Mantener higiene en áreas de acopio y transporte.",
      "Retirar frutos muy maduros o dañados del lote.",
      "Secar bien el racimo tras el lavado cuando se practique.",
      "Aplicar tratamientos poscosecha autorizados solo si el mercado lo requiere.",
      "Reducir humedad excesiva en almacenamiento.",
    ],
    content_md: "",
  },
  {
    id: "local-cogollero",
    slug: "cogollero-maiz",
    title: "Cogollero del maíz",
    crop: "Maíz",
    infection_type: "Plaga",
    disease_keywords: ["cogollero", "spodoptera", "gusano", "maiz"],
    duration_min: 5,
    image_src: "/samples/maiz-roya.jpg",
    image_alt: "Referencia de daño foliar en maíz",
    symptoms: [
      "Hojas perforadas en embudo",
      "Excrementos en el cogollo",
      "Plantas con meristemo dañado",
    ],
    description:
      "El cogollero (Spodoptera frugiperda) es la principal plaga del maíz en muchas zonas tropicales. Las larvas se alimentan en el cogollo, producen orificios irregulares y pueden destruir el punto de crecimiento. El daño es más crítico en etapas vegetativas tempranas y tras lluvias que favorecen nuevos focos.",
    prevention_steps: [
      "Monitorear el cogollo 2 a 3 veces por semana en V2–V8.",
      "Usar umbrales de acción (porcentaje de plantas con larva viva).",
      "Preferir control biológico o productos selectivos cuando sea posible.",
      "Evitar aplicaciones calendarias sin muestreo.",
      "Eliminar malezas hospederas en bordes del lote.",
      "Rotar modos de acción insecticida para retrasar resistencia.",
    ],
    content_md: "",
  },
  {
    id: "local-cercospora-maiz",
    slug: "mancha-gris-maiz",
    title: "Mancha foliar del maíz (Cercospora)",
    crop: "Maíz",
    infection_type: "Hongo",
    disease_keywords: ["cercospora", "mancha gris", "mancha foliar", "maiz"],
    duration_min: 4,
    image_src: "/samples/maiz-roya.jpg",
    image_alt: "Manchas rectangulares en hoja de maíz",
    symptoms: [
      "Manchas rectangulares grises o cafés",
      "Lesiones limitadas por nervaduras",
      "Secado prematuro del follaje",
    ],
    description:
      "La mancha foliar por Cercospora zeae-maydis produce lesiones rectangulares limitadas por las nervaduras. Bajo humedad prolongada puede defoliar la planta y reducir el llenado de grano. Se confunde a veces con otras manchas; el patrón rectangular y el color grisáceo ayudan al diagnóstico de campo.",
    prevention_steps: [
      "Sembrar híbridos con mejor tolerancia foliar.",
      "Evitar densidades excesivas que retengan humedad.",
      "Rotar cultivos para reducir inóculo en rastrojo.",
      "Monitorear hojas medias a partir de floración.",
      "Aplicar fungicida solo si la incidencia supera el umbral económico.",
      "Manejar rastrojo infectado al cierre del ciclo.",
    ],
    content_md: "",
  },
  {
    id: "local-mosaico-maiz",
    slug: "mosaico-maiz",
    title: "Mosaico del maíz",
    crop: "Maíz",
    infection_type: "Virus",
    disease_keywords: ["mosaico", "virus", "maiz", "mdmv"],
    duration_min: 4,
    image_src: "/samples/maiz-roya.jpg",
    image_alt: "Referencia de mosaico clorótico en maíz",
    symptoms: [
      "Moteado clorótico irregular",
      "Plantas achaparradas",
      "Espigas malformadas en casos severos",
    ],
    description:
      "Los mosaicos virales del maíz generan moteado clorótico, reducción de vigor y, en casos severos, espigas defectuosas. Se transmiten por áfidos u otro material infectado. No hay curación química: el manejo es preventivo y cultural.",
    prevention_steps: [
      "Usar semilla de calidad y de origen conocido.",
      "Controlar áfidos vectores según umbral de monitoreo.",
      "Eliminar plantas severamente afectadas temprano.",
      "Evitar siembras escalonadas que mantengan puentes verdes.",
      "Controlar malezas que sirvan de reservorio.",
      "No confundir con deficiencias nutricionales: el mosaico es irregular y no uniforme.",
    ],
    content_md: "",
  },
  {
    id: "local-antracnosis-cafe",
    slug: "antracnosis-cafe",
    title: "Antracnosis del café",
    crop: "Café",
    infection_type: "Hongo",
    disease_keywords: ["antracnosis", "colletotrichum", "cafe", "cereza"],
    duration_min: 4,
    image_src: "/samples/maiz-roya.jpg",
    image_alt: "Referencia de lesiones en hoja/cereza de café",
    symptoms: [
      "Manchas hundidas en cerezas",
      "Necrosis en hojas jóvenes",
      "Caída prematura de grano",
    ],
    description:
      "La antracnosis del café (Colletotrichum spp.) afecta hojas, ramas y cerezas, con manchas necróticas y caída de fruto. Alta humedad, heridas y nutrición deficiente aumentan la severidad, especialmente en variedades susceptibles.",
    prevention_steps: [
      "Mantener nutrición balanceada y poda sanitaria.",
      "Retirar cerezas mumificadas y ramas muy afectadas.",
      "Mejorar aireación regulando sombra y densidad.",
      "Evitar heridas innecesarias en cosecha y poda.",
      "Aplicar fungicidas autorizados en periodos de alto riesgo.",
      "Monitorear focos tras lluvias prolongadas.",
    ],
    content_md: "",
  },
  {
    id: "local-broca-cafe",
    slug: "broca-cafe",
    title: "Broca del café",
    crop: "Café",
    infection_type: "Plaga",
    disease_keywords: ["broca", "hypothenemus", "cafe", "perforacion"],
    duration_min: 5,
    image_src: "/samples/maiz-roya.jpg",
    image_alt: "Referencia de daño en cereza de café",
    symptoms: [
      "Orificio en el ombligo de la cereza",
      "Granos perforados o vanos",
      "Presencia de insecto adulto en fruto",
    ],
    description:
      "La broca (Hypothenemus hampei) perfora la cereza y daña el grano, reduciendo calidad y rendimiento. Se dispersa con frutos maduros remanentes y cosechas incompletas. El manejo integrado combina recolección oportuna, trampas y control biológico.",
    prevention_steps: [
      "Cosechar a tiempo y no dejar cerezas maduras en el árbol.",
      "Recoger granos del suelo (pepenea) en focos intensos.",
      "Instalar trampas de broca para monitoreo.",
      "Usar Beauveria u otros agentes biológicos recomendados localmente.",
      "Evitar transporte de café cereza desde lotes muy infestados sin control.",
      "Registrar porcentaje de cerezas brocadas cada cosecha.",
    ],
    content_md: "",
  },
  {
    id: "local-ojo-gallo",
    slug: "ojo-de-gallo-cafe",
    title: "Ojo de gallo del café",
    crop: "Café",
    infection_type: "Hongo",
    disease_keywords: ["ojo de gallo", "mycena", "cafe", "mancha"],
    duration_min: 4,
    image_src: "/samples/maiz-roya.jpg",
    image_alt: "Manchas circulares tipo ojo de gallo",
    symptoms: [
      "Manchas circulares con centro claro",
      "Defoliación en sombra densa",
      "Lesiones en hojas y a veces en frutos",
    ],
    description:
      "El ojo de gallo (Mycena citricolor) produce manchas circulares características y defoliación en cafetales con sombra excesiva y alta humedad. Es más frecuente en zonas nubladas o con dosel muy cerrado.",
    prevention_steps: [
      "Regular la sombra para aumentar luz y aireación.",
      "Podar para abrir el dosel en focos severos.",
      "Retirar hojas muy afectadas del suelo cuando sea práctico.",
      "Mejorar nutrición para recuperar el follaje.",
      "Aplicar fungicidas autorizados solo si el daño es económico.",
      "Evitar riego por aspersión sobre el follaje.",
    ],
    content_md: "",
  },
  {
    id: "local-piricularia",
    slug: "piricularia-arroz",
    title: "Piricularia (quemazón) del arroz",
    crop: "Arroz",
    infection_type: "Hongo",
    disease_keywords: ["piricularia", "blast", "quemazon", "arroz", "magnaporthe"],
    duration_min: 5,
    image_src: "/samples/maiz-roya.jpg",
    image_alt: "Referencia de lesiones en hoja de arroz",
    symptoms: [
      "Lesiones en forma de diamante",
      "Cuello de la panícula necrosado",
      "Granos vanos o panículas blancas",
    ],
    description:
      "La piricularia (Magnaporthe oryzae) es una de las enfermedades más destructivas del arroz. Produce lesiones foliares en diamante y puede quemar el cuello de la panícula, dejando granos vanos. Se favorece con humedad foliar prolongada, exceso de nitrógeno y variedades susceptibles.",
    prevention_steps: [
      "Sembrar variedades con mejor tolerancia a blast en la zona.",
      "Evitar exceso de nitrógeno en una sola aplicación.",
      "Manejar lámina de agua de forma estable, sin estrés hídrico brusco.",
      "Monitorear hojas y cuello de panícula en etapas críticas.",
      "Aplicar fungicidas preventivos según umbral y etiqueta.",
      "Destruir o incorporar rastrojo infectado al final del ciclo.",
    ],
    content_md: "",
  },
  {
    id: "local-mancha-parda-arroz",
    slug: "mancha-parda-arroz",
    title: "Mancha parda del arroz",
    crop: "Arroz",
    infection_type: "Hongo",
    disease_keywords: ["mancha parda", "bipolaris", "arroz", "helminthosporium"],
    duration_min: 4,
    image_src: "/samples/maiz-roya.jpg",
    image_alt: "Manchas cafés en hoja de arroz",
    symptoms: [
      "Manchas ovaladas cafés",
      "Halo clorótico alrededor",
      "Granos manchados",
    ],
    description:
      "La mancha parda (Bipolaris oryzae) genera lesiones ovaladas cafés en hojas y puede manchar granos. Se asocia a suelos pobres, semilla contaminada y estrés nutricional. Reduce calidad molinera cuando afecta el grano.",
    prevention_steps: [
      "Usar semilla tratada o certificada.",
      "Corregir deficiencias de potasio y silicio según análisis.",
      "Evitar densidades excesivas que retengan humedad.",
      "Rotar o incorporar rastrojo infectado.",
      "Monitorear hojas medias en macollamiento y embuchado.",
      "Aplicar fungicida solo si la incidencia justifica el costo.",
    ],
    content_md: "",
  },
  {
    id: "local-bacteriosis-arroz",
    slug: "bacteriosis-arroz",
    title: "Añublo bacteriano del arroz",
    crop: "Arroz",
    infection_type: "Bacteria",
    disease_keywords: ["bacteria", "añublo", "xanthomonas", "arroz"],
    duration_min: 5,
    image_src: "/samples/maiz-roya.jpg",
    image_alt: "Referencia de rayado bacteriano en arroz",
    symptoms: [
      "Rayas húmedas en la hoja",
      "Exudado amarillento",
      "Secado en forma de quemado",
    ],
    description:
      "El añublo bacteriano (Xanthomonas oryzae) produce rayas húmedas, exudado y quemado foliar. Se dispersa con agua de riego, viento y semilla infectada. El manejo enfatiza semilla limpia, riego controlado y variedades menos susceptibles.",
    prevention_steps: [
      "Usar semilla certificada y de lotes sanos.",
      "Evitar movimientos de agua desde focos hacia áreas sanas.",
      "No trabajar el lote con follaje muy mojado si hay focos activos.",
      "Eliminar malezas hospederas en canales y bordes.",
      "Preferir variedades con mejor comportamiento sanitario local.",
      "Consultar técnico ante avance rápido tipo quemado.",
    ],
    content_md: "",
  },
  {
    id: "local-oidio",
    slug: "oidio-hortalizas",
    title: "Oídio en hortalizas y frutales",
    crop: "General",
    infection_type: "Hongo",
    disease_keywords: ["oidio", "ceniza", "mildiu polvoso", "powdery"],
    duration_min: 4,
    image_src: "/samples/sigatoka.jpg",
    image_alt: "Polvillo blanco tipo oídio en hoja",
    symptoms: [
      "Polvillo blanco en haz de la hoja",
      "Hojas encarrujadas",
      "Reducción de vigor",
    ],
    description:
      "El oídio forma un polvillo blanco-cenizo sobre hojas y brotes. A diferencia de muchos hongos, puede desarrollarse con humedad relativa moderada y días secos intercalados. Reduce fotosíntesis y calidad de fruto en hortalizas y algunos frutales.",
    prevention_steps: [
      "Mejorar aireación y evitar densidades excesivas.",
      "Regar al suelo, no al follaje, cuando sea posible.",
      "Retirar hojas muy cubiertas de micelio.",
      "Aplicar azufre u otros fungicidas autorizados según cultivo.",
      "Monitorear el envés y haz en brotes nuevos.",
      "No confundir con residuos de agroquímicos o polvo de camino.",
    ],
    content_md: "",
  },
  {
    id: "local-mildiu",
    slug: "mildiu-hortalizas",
    title: "Mildiu en hortalizas",
    crop: "General",
    infection_type: "Hongo",
    disease_keywords: ["mildiu", "downy", "peronospora", "hortaliza"],
    duration_min: 4,
    image_src: "/samples/sigatoka.jpg",
    image_alt: "Manchas aceitosas asociadas a mildiu",
    symptoms: [
      "Manchas aceitosas en el haz",
      "Esporulación grisácea en el envés",
      "Secado rápido del tejido",
    ],
    description:
      "El mildiu (Peronosporales) produce manchas aceitosas y esporulación en el envés bajo alta humedad y rocío nocturno. Puede destruir follaje en pocos días en hortalizas de hoja y solanáceas. El control es preventivo porque el avance es muy rápido.",
    prevention_steps: [
      "Evitar mojar el follaje al final de la tarde.",
      "Aumentar aireación entre hileras.",
      "Aplicar fungicidas preventivos antes de lluvias previstas.",
      "Retirar plantas muy afectadas del lote.",
      "Rotar cultivos y no dejar residuos infectados.",
      "Usar el pronóstico de humedad de AgroGuardian para anticipar riesgo.",
    ],
    content_md: "",
  },
  {
    id: "local-acaros",
    slug: "acaro-rojo",
    title: "Ácaro rojo / araña roja",
    crop: "General",
    infection_type: "Plaga",
    disease_keywords: ["acaro", "araña roja", "tetranychus", "telaraña"],
    duration_min: 4,
    image_src: "/samples/maiz-roya.jpg",
    image_alt: "Referencia de moteado por ácaros",
    symptoms: [
      "Punteado clorótico fino",
      "Telaraña en envés",
      "Hojas bronceadas o secas",
    ],
    description:
      "Los ácaros tetraníquidos succionan savia y producen punteado fino, bronceado y telarañas en el envés. Proliferan con calor seco y polvo. Un mal diagnóstico lleva a aplicar insecticidas innecesarios que eliminan enemigos naturales y empeoran el brote.",
    prevention_steps: [
      "Inspeccionar el envés con lupa en bordes secos del lote.",
      "Evitar polvo excesivo en caminos internos.",
      "Mantener riego adecuado para reducir estrés hídrico.",
      "Liberar o conservar depredadores naturales cuando sea viable.",
      "Usar acaricidas específicos, no insecticidas de amplio espectro.",
      "Rotar modos de acción para evitar resistencia.",
    ],
    content_md: "",
  },
  {
    id: "local-nematodos",
    slug: "nematodos-suelo",
    title: "Nemátodos del suelo",
    crop: "General",
    infection_type: "Plaga",
    disease_keywords: ["nematodo", "meloidogyne", "nudos", "raiz"],
    duration_min: 5,
    image_src: "/samples/maiz-roya.jpg",
    image_alt: "Referencia de estrés radicular",
    symptoms: [
      "Plantas raquíticas en manchones",
      "Nudosidad en raíces",
      "Marchitez en horas de calor",
    ],
    description:
      "Los nemátodos fitoparásitos (como Meloidogyne) dañan raíces, forman nudos y reducen la absorción de agua y nutrientes. El síntoma aéreo parece sequía o deficiencia, pero se concentra en manchones. El diagnóstico confirma con inspección de raíces o análisis de suelo.",
    prevention_steps: [
      "Inspeccionar raíces de plantas raquíticas en focos.",
      "Rotar con cultivos no hospederos cuando sea posible.",
      "Usar material de siembra limpio y sustratos desinfectados en vivero.",
      "Mejorar materia orgánica y estructura del suelo.",
      "Evitar mover suelo de focos a lotes sanos.",
      "Evaluar control biológico o químico con asesoramiento técnico.",
    ],
    content_md: "",
  },
  {
    id: "local-deficiencia-n",
    slug: "deficiencia-nitrogeno",
    title: "Deficiencia de nitrógeno",
    crop: "General",
    infection_type: "Fisiopatia",
    disease_keywords: ["nitrogeno", "deficiencia", "amarillamiento", "clorosis"],
    duration_min: 3,
    image_src: "/samples/maiz-roya.jpg",
    image_alt: "Amarillamiento uniforme por deficiencia",
    symptoms: [
      "Amarillamiento de hojas viejas",
      "Crecimiento lento",
      "Sin manchas ni esporas",
    ],
    description:
      "La falta de nitrógeno produce clorosis progresiva desde hojas viejas hacia las jóvenes, con plantas pálidas y menor crecimiento. No hay pústulas ni lesiones locales. Confirmar con historial de fertilización y, idealmente, análisis de suelo o foliar.",
    prevention_steps: [
      "Aplicar N según etapa del cultivo y análisis de suelo.",
      "Fraccionar dosis en cultivos de ciclo largo.",
      "Corregir encharcamientos que lavan o desnitrifican el N.",
      "Incorporar materia orgánica para mejorar retención.",
      "Diferenciar de virosis: la deficiencia es más uniforme y empieza en hojas basales.",
      "Registrar respuestas a 7–10 días tras la corrección.",
    ],
    content_md: "",
  },
  {
    id: "local-deficiencia-k",
    slug: "deficiencia-potasio",
    title: "Deficiencia de potasio",
    crop: "General",
    infection_type: "Fisiopatia",
    disease_keywords: ["potasio", "deficiencia", "borde", "necrosis"],
    duration_min: 3,
    image_src: "/samples/sigatoka.jpg",
    image_alt: "Necrosis marginal por deficiencia de potasio",
    symptoms: [
      "Quemado o clorosis en bordes",
      "Hojas viejas afectadas primero",
      "Frutos o granos de menor calidad",
    ],
    description:
      "La deficiencia de potasio suele mostrar clorosis o necrosis en los bordes de hojas maduras, menor tolerancia a sequía y peor calidad de fruto o grano. Se diferencia de muchas infecciones porque el patrón es marginal y simétrico, sin esporulación.",
    prevention_steps: [
      "Ajustar fertilización potásica según análisis de suelo.",
      "Evitar desbalances con exceso de calcio o magnesio.",
      "Mantener humedad de suelo estable para favorecer absorción.",
      "En plátano y cacao, vigilar bordes foliares en etapas de alta demanda.",
      "No aplicar fungicidas si no hay signos de patógeno.",
      "Reevaluar a las 2 semanas tras la corrección nutricional.",
    ],
    content_md: "",
  },
  {
    id: "local-cochinilla-cacao",
    slug: "cochinilla-cacao",
    title: "Cochinillas en cacao",
    crop: "Cacao",
    infection_type: "Plaga",
    disease_keywords: ["cochinilla", "escama", "cacao", "fumagina"],
    duration_min: 4,
    image_src: "/samples/cacao-monilia.jpg",
    image_alt: "Referencia de daño asociado a cochinillas",
    symptoms: [
      "Insectos algodonosos en brotes",
      "Fumagina negra en hojas",
      "Brotes debilitados",
    ],
    description:
      "Las cochinillas succionan savia en brotes y mazorcas jóvenes, excretan melaza que favorece fumagina y reduce fotosíntesis. Suelen aparecer en brotes tiernos, sombra densa y cuando faltan depredadores naturales.",
    prevention_steps: [
      "Inspeccionar brotes y pedúnculos de mazorcas jóvenes.",
      "Favorecer enemigos naturales evitando insecticidas de amplio espectro.",
      "Podar para airear y reducir refugios.",
      "Lavar o retirar colonias localizadas en focos pequeños.",
      "Usar aceites o insecticidas selectivos autorizados si el umbral se supera.",
      "Controlar hormigas que protegen colonias de cochinillas.",
    ],
    content_md: "",
  },
  {
    id: "local-helopeltis",
    slug: "chinche-helopeltis-cacao",
    title: "Chinche Helopeltis del cacao",
    crop: "Cacao",
    infection_type: "Plaga",
    disease_keywords: ["helopeltis", "chinche", "cacao", "punteado"],
    duration_min: 4,
    image_src: "/samples/cacao-monilia.jpg",
    image_alt: "Punteado en mazorca de cacao",
    symptoms: [
      "Punteado necrótico en mazorca",
      "Deformación del fruto joven",
      "Lesiones en brotes tiernos",
    ],
    description:
      "Helopeltis spp. pican mazorcas y brotes, dejando puntos necróticos y deformaciones que reducen calidad. El daño se concentra en frutos jóvenes y puede confundirse con inicio de enfermedades fúngicas si no se busca el insecto.",
    prevention_steps: [
      "Monitorear mazorcas jóvenes en bordes sombreados.",
      "Mantener maleza controlada sin dejar el suelo totalmente desnudo.",
      "Podar chupones y brotes muy densos.",
      "Usar control cultural y biológico antes que químicos de amplio espectro.",
      "Aplicar insecticida selectivo solo si hay daño económico.",
      "Registrar porcentaje de mazorcas con punteado fresco.",
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
