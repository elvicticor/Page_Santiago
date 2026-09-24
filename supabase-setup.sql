-- Ejecuta este archivo una vez en Supabase > SQL Editor (además del supabase/schema.sql de la votación).
create extension if not exists pgcrypto;

create table if not exists public.fotos (
  id uuid primary key default gen_random_uuid(),
  nombre text,
  hashtag text,
  url text not null,
  aprobado boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.fotos enable row level security;

drop policy if exists "publico_puede_insertar_fotos_sin_aprobar" on public.fotos;
create policy "publico_puede_insertar_fotos_sin_aprobar"
  on public.fotos for insert
  to anon
  with check (aprobado = false);

drop policy if exists "publico_puede_ver_fotos_aprobadas" on public.fotos;
create policy "publico_puede_ver_fotos_aprobadas"
  on public.fotos for select
  to anon
  using (aprobado = true);

-- No hay política de UPDATE/DELETE para "anon": solo tú puedes aprobar/borrar,
-- entrando a Table Editor -> fotos en el dashboard de Supabase.

-- Bucket de almacenamiento para las imágenes subidas.
insert into storage.buckets (id, name, public)
values ('fotos-gala', 'fotos-gala', true)
on conflict (id) do nothing;

drop policy if exists "publico_puede_subir_a_fotos_gala" on storage.objects;
create policy "publico_puede_subir_a_fotos_gala"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'fotos-gala');

notify pgrst, 'reload schema';
