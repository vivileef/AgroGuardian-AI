# Despliegue en Vercel (monorepo)

El Next.js vive en **`web/`**. Si Vercel construye desde la raíz del repo, sale:

`404: NOT_FOUND` (Code: NOT_FOUND)

## Arreglo (obligatorio)

1. Entra a [vercel.com](https://vercel.com) → tu proyecto → **Settings**
2. **General → Root Directory** → Edit → escribe `web` → Save
3. **Build & Development Settings**
   - Framework Preset: **Next.js**
   - Build Command: `npm run build` (default)
   - Output Directory: **dejar vacío** (no pongas `.next`)
   - Install Command: `npm install`
4. **Environment Variables** → pega todas las de producción (Clerk, Supabase, OpenRouter, `DEMO_MODE=false`)
5. **Deployments** → ⋮ en el último → **Redeploy** (sin cache si quieres: uncheck “Use existing Build Cache”)

## Clerk

En [dashboard.clerk.com](https://dashboard.clerk.com) → Domains:

- tu URL `*.vercel.app`
- `localhost:3000` (para local)

## Comprobar el build

En el log del deployment debe verse algo como:

- `Root Directory: web`
- `Framework: Next.js`
- `Compiled successfully` / rutas generadas

Si el Root Directory sigue vacío o es `.`, el 404 volverá.

## Redeploy desde CLI (opcional)

```powershell
cd web
npx vercel login
npx vercel --prod
```

(Eso despliega desde `web/` directamente.)

## URL del proyecto

- Producción: https://agro-guardian-ai-bice.vercel.app
- Settings: https://vercel.com/evelynfaubla-8045s-projects/agro-guardian-ai/settings/general
