create table public.charities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamp with time zone default now()
);

alter table public.profiles
add column charity_id uuid references public.charities(id);