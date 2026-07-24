import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { DiagnosisResult } from "@/types/api";

/** Helvetica (WinAnsi) — normalizamos acentos para salida estable. */
function pdfSafe(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E\n]/g, "?")
    .replace(/\s+/g, " ")
    .trim();
}

function wrapMeasured(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = pdfSafe(text).split(" ").filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (font.widthOfTextAtSize(next, size) > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function riskRgb(level: string) {
  const l = level.toLowerCase();
  if (l === "critico" || l === "alto") return rgb(0.76, 0.07, 0.12);
  if (l === "medio") return rgb(0.83, 0.63, 0.09);
  return rgb(0.18, 0.42, 0.31);
}

export async function buildReportPdf(result: DiagnosisResult): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const pageSize: [number, number] = [595.28, 841.89];
  const margin = 48;
  const contentWidth = pageSize[0] - margin * 2;
  const forest = rgb(0.11, 0.26, 0.2);
  const leaf = rgb(0.18, 0.42, 0.31);
  const ink = rgb(0.07, 0.13, 0.09);
  const muted = rgb(0.4, 0.45, 0.42);
  const cream = rgb(0.97, 0.96, 0.93);

  let page = doc.addPage(pageSize);
  let y = pageSize[1] - margin;
  let pageNo = 1;

  const newPage = () => {
    drawFooter(page, pageNo);
    page = doc.addPage(pageSize);
    pageNo += 1;
    y = pageSize[1] - margin;
  };

  const ensureSpace = (needed: number) => {
    if (y - needed < margin + 28) newPage();
  };

  const drawFooter = (p: PDFPage, n: number) => {
    p.drawText(pdfSafe(`AgroGuardian AI  ·  pag. ${n}`), {
      x: margin,
      y: 24,
      size: 8,
      font,
      color: muted,
    });
  };

  const drawLines = (
    text: string,
    opts: { bold?: boolean; size?: number; color?: ReturnType<typeof rgb>; gap?: number } = {}
  ) => {
    const size = opts.size ?? 11;
    const f = opts.bold ? fontBold : font;
    const color = opts.color ?? ink;
    const lines = wrapMeasured(text, f, size, contentWidth);
    for (const line of lines) {
      ensureSpace(size + 5);
      page.drawText(line, { x: margin, y: y - size, size, font: f, color });
      y -= size + (opts.gap ?? 4);
    }
  };

  // Header band
  page.drawRectangle({
    x: 0,
    y: pageSize[1] - 86,
    width: pageSize[0],
    height: 86,
    color: forest,
  });
  page.drawText(pdfSafe("AgroGuardian AI"), {
    x: margin,
    y: pageSize[1] - 38,
    size: 12,
    font: fontBold,
    color: rgb(0.75, 0.9, 0.8),
  });
  page.drawText(pdfSafe("Reporte de diagnostico"), {
    x: margin,
    y: pageSize[1] - 62,
    size: 20,
    font: fontBold,
    color: rgb(1, 1, 1),
  });
  y = pageSize[1] - 108;

  drawLines(`ID: ${result.id}`, { size: 9, color: muted });
  drawLines(`Fecha: ${new Date(result.created_at).toLocaleString("es-EC")}`, {
    size: 9,
    color: muted,
  });
  y -= 10;

  // Detection card background
  const detBlockH = 110;
  ensureSpace(detBlockH + 20);
  page.drawRectangle({
    x: margin - 4,
    y: y - detBlockH,
    width: contentWidth + 8,
    height: detBlockH,
    color: cream,
    borderColor: rgb(0.85, 0.9, 0.86),
    borderWidth: 1,
  });
  const detTop = y - 18;
  page.drawText(pdfSafe("Deteccion"), {
    x: margin + 8,
    y: detTop,
    size: 13,
    font: fontBold,
    color: leaf,
  });

  const d = result.detection;
  const leftX = margin + 8;
  const rightX = margin + contentWidth / 2 + 4;
  let rowY = detTop - 22;
  const kv = (x: number, label: string, value: string) => {
    page.drawText(pdfSafe(label), { x, y: rowY, size: 8, font, color: muted });
    page.drawText(pdfSafe(value), { x, y: rowY - 14, size: 11, font: fontBold, color: ink });
  };
  kv(leftX, "Cultivo", d.crop);
  kv(rightX, "Enfermedad", d.disease);
  rowY -= 36;
  kv(leftX, "Confianza", `${Math.round(d.confidence * 100)}%`);
  kv(rightX, "Parte afectada", d.affected_part);

  // Risk badge
  const riskColor = riskRgb(d.risk_level);
  const riskLabel = pdfSafe(`RIESGO ${d.risk_level.toUpperCase()}`);
  const badgeW = fontBold.widthOfTextAtSize(riskLabel, 9) + 16;
  page.drawRectangle({
    x: margin + contentWidth - badgeW - 4,
    y: detTop - 4,
    width: badgeW,
    height: 18,
    color: riskColor,
  });
  page.drawText(riskLabel, {
    x: margin + contentWidth - badgeW - 4 + 8,
    y: detTop + 1,
    size: 9,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  y -= detBlockH + 16;

  if (d.rationale) {
    drawLines("Fundamento", { bold: true, size: 12, color: leaf });
    y -= 2;
    drawLines(d.rationale, { size: 10 });
    y -= 10;
  }

  drawLines("Diagnostico", { bold: true, size: 13, color: leaf });
  y -= 2;
  drawLines(result.diagnosis, { size: 11 });
  y -= 12;

  drawLines("Clima", { bold: true, size: 13, color: leaf });
  y -= 2;
  drawLines(`${result.weather.location} — ${result.weather.condition}`, { size: 10 });
  drawLines(
    `Temp: ${result.weather.temperature_c} C  |  Humedad: ${result.weather.humidity_pct}%  |  Lluvia: ${result.weather.rain_mm} mm  |  Viento: ${result.weather.wind_kmh} km/h`,
    { size: 10 }
  );
  drawLines(`Riesgo climatico: ${result.weather.climate_risk}`, { size: 10, bold: true });
  y -= 14;

  // Recommendations table
  drawLines("Recomendaciones", { bold: true, size: 13, color: leaf });
  y -= 6;
  const colW = [28, contentWidth - 28 - 70, 70];
  const headerY = y;
  ensureSpace(22);
  page.drawRectangle({
    x: margin,
    y: headerY - 18,
    width: contentWidth,
    height: 18,
    color: leaf,
  });
  page.drawText("#", { x: margin + 6, y: headerY - 13, size: 9, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText("Accion", {
    x: margin + colW[0] + 4,
    y: headerY - 13,
    size: 9,
    font: fontBold,
    color: rgb(1, 1, 1),
  });
  page.drawText("Plazo", {
    x: margin + colW[0] + colW[1] + 4,
    y: headerY - 13,
    size: 9,
    font: fontBold,
    color: rgb(1, 1, 1),
  });
  y = headerY - 22;

  result.recommendations.forEach((r, i) => {
    const titleLines = wrapMeasured(r.title, fontBold, 10, colW[1] - 8);
    const detailLines = wrapMeasured(r.detail, font, 9, colW[1] - 8);
    const blockH = Math.max(28, (titleLines.length + detailLines.length) * 12 + 10);
    ensureSpace(blockH + 4);
    if (i % 2 === 0) {
      page.drawRectangle({
        x: margin,
        y: y - blockH,
        width: contentWidth,
        height: blockH,
        color: cream,
      });
    }
    page.drawText(String(i + 1), {
      x: margin + 8,
      y: y - 14,
      size: 10,
      font: fontBold,
      color: ink,
    });
    let ty = y - 14;
    for (const line of titleLines) {
      page.drawText(line, { x: margin + colW[0] + 4, y: ty, size: 10, font: fontBold, color: ink });
      ty -= 12;
    }
    for (const line of detailLines) {
      page.drawText(line, { x: margin + colW[0] + 4, y: ty, size: 9, font, color: muted });
      ty -= 11;
    }
    page.drawText(pdfSafe(r.timeframe || "—"), {
      x: margin + colW[0] + colW[1] + 4,
      y: y - 14,
      size: 9,
      font,
      color: ink,
    });
    y -= blockH + 2;
  });

  y -= 12;
  drawLines("Plan de seguimiento", { bold: true, size: 13, color: leaf });
  y -= 2;
  drawLines(`Revision en ${result.follow_up.check_in_hours} h`, { size: 10, bold: true });
  result.follow_up.steps.forEach((s) => drawLines(`- ${s}`, { size: 10 }));

  y -= 18;
  drawLines(`Generado: ${new Date().toLocaleString("es-EC")}`, { size: 8, color: muted });

  drawFooter(page, pageNo);
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
