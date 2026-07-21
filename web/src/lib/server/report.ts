import type { DiagnosisResult } from "@/types/api";

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
