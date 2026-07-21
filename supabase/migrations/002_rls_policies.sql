-- AgroGuardian AI — RLS policies + demo seed
-- Run after 001_schema.sql

-- Helper: owner can access own rows (Clerk user id in owner_id / profiles.id)
create policy "profiles_select_own" on public.profiles
  for select using (id = current_setting('request.jwt.claim.sub', true));

create policy "profiles_insert_own" on public.profiles
  for insert with check (id = current_setting('request.jwt.claim.sub', true));

create policy "profiles_update_own" on public.profiles
  for update using (id = current_setting('request.jwt.claim.sub', true));

create policy "farms_owner" on public.farms
  for all using (owner_id = current_setting('request.jwt.claim.sub', true))
  with check (owner_id = current_setting('request.jwt.claim.sub', true));

create policy "plots_via_farm" on public.plots
  for all using (
    exists (
      select 1 from public.farms f
      where f.id = plots.farm_id
        and f.owner_id = current_setting('request.jwt.claim.sub', true)
    )
  );

create policy "crops_via_farm" on public.crops
  for all using (
    exists (
      select 1 from public.farms f
      where f.id = crops.farm_id
        and f.owner_id = current_setting('request.jwt.claim.sub', true)
    )
  );

create policy "images_owner" on public.images
  for all using (owner_id = current_setting('request.jwt.claim.sub', true))
  with check (owner_id = current_setting('request.jwt.claim.sub', true));

create policy "detections_owner" on public.detections
  for all using (owner_id = current_setting('request.jwt.claim.sub', true))
  with check (owner_id = current_setting('request.jwt.claim.sub', true));

create policy "recommendations_via_detection" on public.recommendations
  for all using (
    exists (
      select 1 from public.detections d
      where d.id = recommendations.detection_id
        and d.owner_id = current_setting('request.jwt.claim.sub', true)
    )
  );

create policy "weather_via_farm" on public.weather_logs
  for select using (
    farm_id is null or exists (
      select 1 from public.farms f
      where f.id = weather_logs.farm_id
        and f.owner_id = current_setting('request.jwt.claim.sub', true)
    )
  );

create policy "reports_owner" on public.reports
  for all using (owner_id = current_setting('request.jwt.claim.sub', true))
  with check (owner_id = current_setting('request.jwt.claim.sub', true));

create policy "notifications_owner" on public.notifications
  for all using (owner_id = current_setting('request.jwt.claim.sub', true))
  with check (owner_id = current_setting('request.jwt.claim.sub', true));

-- Storage bucket policy template (run in dashboard):
-- bucket: plant-scans, path: {user_id}/*

-- Demo profile + farm for local development (optional)
insert into public.profiles (id, full_name, province)
values ('demo_user', 'Juan Pérez', 'Manabí')
on conflict (id) do nothing;

insert into public.farms (id, owner_id, name, lat, lng, area_ha, health_status)
values (
  'a1111111-1111-1111-1111-111111111111',
  'demo_user',
  'Finca La Esperanza',
  -1.0547,
  -80.4545,
  12.5,
  'riesgo'
)
on conflict (id) do nothing;

insert into public.crops (farm_id, name, variety, growth_stage, health_pct, status) values
  ('a1111111-1111-1111-1111-111111111111', 'Plátano Barraganete', 'Barraganete', 'Floración', 72, 'riesgo'),
  ('a1111111-1111-1111-1111-111111111111', 'Cacao Nacional', 'Nacional', 'Producción', 91, 'sano'),
  ('a1111111-1111-1111-1111-111111111111', 'Maíz duro', 'INIAP', 'Vegetativo', 88, 'sano'),
  ('a1111111-1111-1111-1111-111111111111', 'Café arábiga', 'Arábiga', 'Crecimiento', 64, 'infectado'),
  ('a1111111-1111-1111-1111-111111111111', 'Arroz INIAP', 'INIAP', 'Macollamiento', 85, 'sano'),
  ('a1111111-1111-1111-1111-111111111111', 'Plátano Dominico', 'Dominico', 'Desarrollo', 79, 'riesgo')
on conflict do nothing;

insert into public.notifications (owner_id, title, body, severity) values
  ('demo_user', 'Sigatoka Negra detectada', 'Lote Plátano · confianza 94%', 'alto'),
  ('demo_user', 'Humedad crítica 87%', 'Riesgo de propagación foliar', 'alto'),
  ('demo_user', 'Seguimiento pendiente', 'Revisar Café arábiga en 24h', 'medio')
on conflict do nothing;
