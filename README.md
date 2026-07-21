# AgroGuardian AI

**Tu agrónomo inteligente disponible 24/7.**

Plataforma de **sanidad vegetal** para agricultores de Manabí: foto de hoja → detección IA → clima → recomendaciones → PDF → historial.

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend + API | Next.js 16 (App Router, `/api/*`) |
| Auth | **Clerk** |
| IA | **OpenRouter** — modelos gratuitos (`:free`) |
| Clima | **Open-Meteo** (gratis) |
| Datos | **Supabase** |
| Legacy | `backend/` FastAPI (opcional, no necesario en Vercel) |

## Despliegue en Vercel (producción)

1. **Root Directory:** `web`
2. Variables de entorno (ver `web/.env.example`):
   - Clerk: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, URLs de sign-in/up
   - Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - OpenRouter: `OPENROUTER_API_KEY`, `OPENROUTER_MODEL=openai/gpt-oss-20b:free`, `OPENROUTER_VISION_MODEL=google/gemma-4-31b-it:free`
3. **No uses** `NEXT_PUBLIC_API_URL` apuntando a `:8000` — la API corre en el mismo dominio
4. En Clerk Dashboard agrega tu dominio `*.vercel.app`
5. Ejecuta migraciones SQL en Supabase (`supabase/migrations/`)

## Inicio local

```powershell
cd web
copy .env.example .env.local
npm install
npm run dev
```

App: http://localhost:3000

### Supabase + OpenRouter

1. Ejecuta `001_schema.sql` y `002_rls_policies.sql` en Supabase
2. Crea API key en [openrouter.ai](https://openrouter.ai) y ponla en `web/.env.local`
3. Sin `OPENROUTER_API_KEY` corre en **modo demo**

### PWA y cámara (Escanear)

- Instala como PWA desde el navegador (manifest + service worker)
- Muestras demo estilo PlantVillage en **Escanear**
- HTTPS o `localhost` son necesarios para `getUserMedia`

## Flujo de agentes

```
Foto → Disease Detector (visión) → Climate Agent (Open-Meteo)
     → Agronomist (diagnóstico + plan) → Report Agent (PDF + historial)
```

## Estructura

```
AgroGuardian-AI/
  web/               # Next.js UI + API routes (desplegar esto en Vercel)
  backend/           # FastAPI legacy (opcional en local)
  supabase/          # SQL schema + RLS
```
