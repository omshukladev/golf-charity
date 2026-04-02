alter table public.draws
add column status text default 'pending',
add column proof_url text;