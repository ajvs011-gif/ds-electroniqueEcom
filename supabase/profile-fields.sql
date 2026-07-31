-- =========================================================
-- DS-ELECTRONIQUE — Complément : capturer toutes les infos
-- client à l'inscription (téléphone, ville en plus du nom)
-- À exécuter après schema.sql, seed.sql et admin.sql
-- =========================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone, city)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'city'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Le trigger on_auth_user_created existe déjà (créé dans schema.sql) et
-- pointe vers cette fonction par son nom : il n'a pas besoin d'être recréé.
