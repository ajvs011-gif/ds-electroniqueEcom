-- =========================================================
-- DS-ELECTRONIQUE — Phase 5 : Back-office admin
-- À exécuter après schema.sql et seed.sql
-- =========================================================

-- ---------- RÔLE ADMIN ----------
alter table profiles add column if not exists is_admin boolean not null default false;

-- Fonction utilitaire : l'utilisateur courant est-il admin ?
create or replace function public.is_admin()
returns boolean as $$
  select coalesce(
    (select is_admin from profiles where id = auth.uid()),
    false
  );
$$ language sql security definer stable;

-- ---------- PRODUITS / CATÉGORIES : écriture réservée aux admins ----------
create policy "Admin peut créer des produits" on products for insert with check (public.is_admin());
create policy "Admin peut modifier les produits" on products for update using (public.is_admin());
create policy "Admin peut supprimer les produits" on products for delete using (public.is_admin());

create policy "Admin peut créer des catégories" on categories for insert with check (public.is_admin());
create policy "Admin peut modifier les catégories" on categories for update using (public.is_admin());
create policy "Admin peut supprimer les catégories" on categories for delete using (public.is_admin());

-- ---------- COMMANDES : un admin peut tout voir et changer le statut ----------
create policy "Admin peut lire toutes les commandes" on orders for select using (public.is_admin());
create policy "Admin peut modifier le statut des commandes" on orders for update using (public.is_admin());
create policy "Admin peut lire toutes les lignes de commande" on order_items for select using (public.is_admin());

-- ---------- PROFILS : un admin peut lire tous les profils (page Utilisateurs) ----------
create policy "Admin peut lire tous les profils" on profiles for select using (public.is_admin());
create policy "Admin peut modifier tous les profils" on profiles for update using (public.is_admin());

-- ---------- STORAGE : upload/suppression des photos produits réservés aux admins ----------
create policy "Admin peut uploader des photos produits"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());
create policy "Admin peut supprimer des photos produits"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());

-- =========================================================
-- Pour promouvoir votre premier compte admin, exécutez
-- (en remplaçant l'email) une fois inscrit sur le site :
--
-- update profiles set is_admin = true
-- where id = (select id from auth.users where email = 'vous@exemple.com');
-- =========================================================
