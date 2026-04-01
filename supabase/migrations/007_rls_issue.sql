alter table public.charities enable row level security;

create policy "allow read charities"
on public.charities
for select
using (true);