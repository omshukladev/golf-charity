create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    'User_' || substr(new.id::text, 1, 6)
  )
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql;