create table public.scores (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  score integer not null
    check (score >= 1 and score <= 45),

  played_at date not null,

  created_at timestamp with time zone default now()
);

-- index for faster queries
create index on public.scores (user_id, created_at desc);


alter table public.scores enable row level security;

create policy "select own scores"
on public.scores
for select
using (auth.uid() = user_id);

create policy "insert own scores"
on public.scores
for insert
with check (auth.uid() = user_id);

create policy "delete own scores"
on public.scores
for delete
using (auth.uid() = user_id);