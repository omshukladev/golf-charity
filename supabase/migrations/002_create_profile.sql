create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  full_name text,
  avatar_url text,

  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "select own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "update own profile"
on public.profiles
for update
using (auth.uid() = id);