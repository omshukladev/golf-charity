create table public.draws (
  id uuid primary key default gen_random_uuid(),

  user_id uuid references auth.users(id) on delete cascade,
  charity_id uuid references public.charities(id),

  month text not null,
  year int not null,

  is_winner boolean default false,

  created_at timestamp with time zone default now()
);

create index on public.draws (month, year);
create index on public.draws (user_id);

alter table public.draws enable row level security;

-- users can see their own entries
create policy "select own draws"
on public.draws
for select
using (auth.uid() = user_id);