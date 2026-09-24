-- Ejecuta este archivo una vez en Supabase > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.votes (
    id uuid primary key default gen_random_uuid(),
    ballot_id uuid,
    user_id uuid references auth.users(id) on delete cascade,
    category text not null check (char_length(category) between 2 and 100),
    nominee text not null check (char_length(nominee) between 1 and 150),
    created_at timestamptz not null default now(),
    unique (ballot_id, category)
);

alter table public.votes enable row level security;

-- Migración desde la primera versión, que identificaba el navegador con ballot_id.
alter table public.votes alter column ballot_id drop not null;
alter table public.votes add column if not exists user_id uuid references auth.users(id) on delete cascade;
create index if not exists votes_user_id_idx on public.votes(user_id);
create unique index if not exists votes_user_category_unique
on public.votes(user_id, category)
where user_id is not null;

drop policy if exists "public_can_submit_votes" on public.votes;
drop policy if exists "authenticated_users_submit_own_votes" on public.votes;
drop policy if exists "users_read_own_votes" on public.votes;

create policy "authenticated_users_submit_own_votes"
on public.votes for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "users_read_own_votes"
on public.votes for select
to authenticated
using ((select auth.uid()) = user_id);

revoke all on table public.votes from anon, authenticated;
grant select, insert on table public.votes to authenticated;

-- Perfil público interno asociado a cada cuenta de Supabase Auth.
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    display_name text not null check (char_length(display_name) between 2 and 80),
    created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
revoke all on table public.profiles from anon, authenticated;
grant select, update on table public.profiles to authenticated;

drop policy if exists "users_read_own_profile" on public.profiles;
drop policy if exists "users_update_own_profile" on public.profiles;

create policy "users_read_own_profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy "users_update_own_profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.profiles (id, display_name)
    values (new.id, coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1)));
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- La tabla no tiene política SELECT: el público no puede descargar votos individuales.
create or replace function public.get_vote_results()
returns table(category text, nominee text, votes bigint)
language sql
security definer
set search_path = public
stable
as $$
    select v.category, v.nominee, count(*)::bigint
    from public.votes v
    group by v.category, v.nominee
    order by v.category, count(*) desc;
$$;

revoke all on function public.get_vote_results() from public;
grant execute on function public.get_vote_results() to anon;
grant execute on function public.get_vote_results() to authenticated;

-- Fuerza a la API REST de Supabase a reconocer inmediatamente la tabla y función.
notify pgrst, 'reload schema';
