alter table public.profiles
add column is_subscribed boolean default false;

alter table public.profiles
add column plan text;