import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { DiagnosisResult } from "@/types/api";

/** Helvetica (WinAnsi) no cubre todos los glifos latinos; normalizamos para PDF estable. */
function pdfSafe(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E\n]/g, "?")
    .replace(/\s+/g, " ")
    .trim();
}

function wrapText(text: string, maxChars: number): string[] {
  const words = pdfSafe(text).split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > maxChars) {
      if (line) lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

export async function buildReportPdf(result: DiagnosisResult): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const pageSize: [number, number] = [595.28, 841.89]; // A4
  let page = doc.addPage(pageSize);
  const margin = 48;
  const maxWidth = pageSize[0] - margin * 2;
  const maxChars = 92;
  let y = pageSize[1] - margin;

  const ensureSpace = (needed: number) => {
    if (y - needed < margin) {
      page = doc.addPage(pageSize);
      y = pageSize[1] - margin;
    }
  };

  const draw = (text: string, opts: { bold?: boolean; size?: number; color?: ReturnType<typeof rgb> } = {}) => {
    const size = opts.size ?? 11;
    const f = opts.bold ? fontBold : font;
    const color = opts.color ?? rgb(0.07, 0.13, 0.09);
    const lines = wrapText(text, maxChars);
    for (const line of lines) {
      ensureSpace(size + 4);
      page.drawText(line, { x: margin, y, size, font: f, color, maxWidth });
      y -= size + 4;
    }
  };

  const gap = (n = 10) => {
    y -= n;
  };

  draw("AgroGuardian AI — Reporte de diagnostico", {
    bold: true,
    size: 18,
    color: rgb(0.11, 0.26, 0.2),
  });
  gap(8);
  draw(`ID: ${result.id}`);
  draw(`Fecha: ${new Date(result.created_at).toLocaleString("es-EC")}`);
  gap(14);

  draw("Deteccion", { bold: true, size: 14, color: rgb(0.18, 0.42, 0.31) });
  gap(4);
  draw(`Cultivo: ${result.detection.crop}`);
  draw(`Enfermedad: ${result.detection.disease}`);
  draw(`Confianza: ${Math.round(result.detection.confidence * 100)}%`);
  draw(`Riesgo: ${result.detection.risk_level.toUpperCase()}`);
  draw(`Parte afectada: ${result.detection.affected_part}`);
  if (result.detection.rationale) draw(`Fundamento: ${result.detection.rationale}`);
  gap(12);

  draw("Diagnostico", { bold: true, size: 14, color: rgb(0.18, 0.42, 0.31) });
  gap(4);
  draw(result.diagnosis);
  gap(12);

  draw("Clima", { bold: true, size: 14, color: rgb(0.18, 0.42, 0.31) });
  gap(4);
  draw(`${result.weather.location} — ${result.weather.condition}`);
  draw(
    `Temp: ${result.weather.temperature_c} C · Humedad: ${result.weather.humidity_pct}% · Lluvia: ${result.weather.rain_mm} mm · Viento: ${result.weather.wind_kmh} km/h`
  );
  draw(`Riesgo climatico: ${result.weather.climate_risk}`);
  gap(12);

  draw("Recomendaciones", { bold: true, size: 14, color: rgb(0.18, 0.42, 0.31) });
  gap(4);
  result.recommendations.forEach((r, i) => {
    draw(`${i + 1}. ${r.title} (${r.timeframe})`, { bold: true, size: 11 });
    draw(r.detail);
    gap(6);
  });
  gap(6);

  draw("Plan de seguimiento", { bold: true, size: 14, color: rgb(0.18, 0.42, 0.31) });
  gap(4);
  draw(`Revision en ${result.follow_up.check_in_hours} h`);
  result.follow_up.steps.forEach((s) => draw(`• ${s}`));
  gap(16);

  draw(`Generado por AgroGuardian AI · ${new Date().toISOString().slice(0, 16)} UTC`, {
    size: 8,
    color: rgb(0.45, 0.45, 0.45),
  });

  return doc.save();
}

export function buildReportHtml(result: DiagnosisResult) {
  const recRows = result.recommendations
    .map(
      (r, i) =>
        `<tr><td>${i + 1}</td><td><strong>${r.title}</strong><br/>${r.detail}</td><td>${r.timeframe}</td></tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"/>
<title>AgroGuardian — ${result.id.slice(0, 8)}</title>
<style>
  body{font-family:system-ui,sans-serif;max-width:720px;margin:2rem auto;color:#122018;line-height:1.5}
  h1{color:#1b4332} table{width:100%;border-collapse:collapse;margin:1rem 0}
  th,td{border:1px solid #d8e2d9;padding:8px;text-align:left;font-size:14px}
  th{background:#2d6a4f;color:#fff}
</style></head><body>
<h1>AgroGuardian AI — Reporte de diagnóstico</h1>
<p><b>ID:</b> ${result.id}<br/><b>Fecha:</b> ${new Date(result.created_at).toLocaleString("es-EC")}</p>
<h2>Detección</h2>
<p>Cultivo: ${result.detection.crop}<br/>Enfermedad: ${result.detection.disease}<br/>
Confianza: ${Math.round(result.detection.confidence * 100)}%<br/>
Riesgo: ${result.detection.risk_level.toUpperCase()}</p>
<h2>Diagnóstico</h2><p>${result.diagnosis}</p>
<h2>Clima</h2><p>${result.weather.location} — ${result.weather.condition}<br/>
Temp: ${result.weather.temperature_c}°C · Humedad: ${result.weather.humidity_pct}%</p>
<h2>Recomendaciones</h2>
<table><thead><tr><th>#</th><th>Acción</th><th>Plazo</th></tr></thead><tbody>${recRows}</tbody></table>
<h2>Seguimiento</h2><ul>${result.follow_up.steps.map((s) => `<li>${s}</li>`).join("")}</ul>
<p style="color:#888;font-size:12px">Generado por AgroGuardian AI</p>
</body></html>`;
}
