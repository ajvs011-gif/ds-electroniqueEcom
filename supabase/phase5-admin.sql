-- =========================================================
-- DS-ELECTRONIQUE — Phase 5 : back-office admin
-- À exécuter après schema.sql et seed.sql
-- =========================================================

-- ---------- RÔLE ADMIN ----------
alter table profiles add column if not exists is_admin boolean not null default false;

-- Fonction utilitaire : l'utilisateur courant est-il admin ?
create or replace function public.is_admin()
returns boolean as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
$$ language sql security definer stable;

-- ---------- DROITS D'ÉCRITURE ADMIN ----------
-- Produits & catégories : lecture publique déjà en place (schema.sql),
-- on ajoute l'écriture réservée aux admins.
create policy "Les admins gèrent les produits" on products
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Les admins gèrent les catégories" on categories
  for all using (public.is_admin()) with check (public.is_admin());

-- Commandes : les admins peuvent tout voir et changer le statut,
-- en plus de la policy existante qui limite chaque client à ses propres commandes.
create policy "Les admins voient toutes les commandes" on orders
  for select using (public.is_admin());
create policy "Les admins modifient les commandes" on orders
  for update using (public.is_admin());
create policy "Les admins voient toutes les lignes de commande" on order_items
  for select using (public.is_admin());

-- Profils : les admins peuvent lister tous les profils (page Utilisateurs)
create policy "Les admins voient tous les profils" on profiles
  for select using (public.is_admin());

-- ---------- PROMOUVOIR VOTRE PREMIER COMPTE ADMIN ----------
-- Remplacez l'email ci-dessous par le vôtre puis exécutez cette ligne
-- une fois que vous vous êtes inscrit(e) normalement sur /inscription :
--
-- update profiles set is_admin = true
-- where id = (select id from auth.users where email = 'vous@exemple.com');
