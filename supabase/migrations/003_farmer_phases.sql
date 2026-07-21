-- Farmer phases P0–P3: richer detections, plot coords, lessons, market prices

alter table public.detections
  add column if not exists diagnosis text,
  add column if not exists weather jsonb,
  add column if not exists follow_up jsonb,
  add column if not exists farm_id uuid references public.farms(id) on delete set null;

alter table public.plots
  add column if not exists lat double precision,
  add column if not exists lng double precision,
  add column if not exists health_status text default 'sano';

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  crop text,
  disease_keywords text[] default '{}',
  duration_min int default 5,
  content_md text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.market_prices (
  id uuid primary key default gen_random_uuid(),
  crop text not null,
  price_usd numeric(10,4) not null,
  unit text default 'kg',
  trend text default 'stable' check (trend in ('up','down','stable')),
  market text not null,
  updated_at timestamptz not null default now()
);

alter table public.lessons enable row level security;
alter table public.market_prices enable row level security;

drop policy if exists lessons_read on public.lessons;
create policy lessons_read on public.lessons for select using (true);

drop policy if exists market_prices_read on public.market_prices;
create policy market_prices_read on public.market_prices for select using (true);

insert into public.lessons (slug, title, crop, disease_keywords, duration_min, content_md)
select * from (values
  ('sigatoka-negra', 'Reconocer y controlar Sigatoka negra', 'Plátano', array['sigatoka','mycosphaerella'], 5,
   E'## Qué es\nManchas necróticas alargadas en hojas de plátano.\n\n## Qué hacer hoy\n1. Retirar hojas muy afectadas.\n2. Evitar riego por aspersión.\n3. Aplicar fungicida según etiqueta MAG.\n\n## Seguimiento\nFoto de la misma planta en 72 h.'),
  ('monilia-cacao', 'Monilia en cacao: detección temprana', 'Cacao', array['monilia','moniliophthora'], 4,
   E'## Señales\nFrutos con manchas chocolate que se blanquean.\n\n## Acción\nRetirar frutos enfermos, mejorar aireación, podar sombra.'),
  ('roya-cafe', 'Roya del café en Manabí', 'Café', array['roya','hemileia'], 5,
   E'## Señales\nPústulas anaranjadas en envés de hoja.\n\n## Acción\nVariedades tolerantes, fertilización balanceada, fungicida preventivo en época lluviosa.')
) as v(slug, title, crop, disease_keywords, duration_min, content_md)
where not exists (select 1 from public.lessons limit 1);

insert into public.market_prices (crop, price_usd, unit, trend, market, updated_at)
select * from (values
  ('Plátano', 0.42, 'kg', 'up', 'Portoviejo', now()),
  ('Cacao', 3.15, 'kg', 'stable', 'Manta', now()),
  ('Maíz', 0.38, 'kg', 'down', 'Chone', now()),
  ('Café', 4.80, 'kg', 'up', 'Jipijapa', now()),
  ('Arroz', 0.55, 'kg', 'stable', 'Portoviejo', now())
) as v(crop, price_usd, unit, trend, market, updated_at)
where not exists (select 1 from public.market_prices limit 1);
