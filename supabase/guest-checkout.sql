-- =========================================================
-- DS-ELECTRONIQUE — Complément : commandes invitées
-- (achat sans compte, avec création de compte optionnelle)
-- À exécuter après schema.sql, seed.sql, admin.sql, profile-fields.sql
-- =========================================================

-- Une commande peut désormais ne pas être liée à un compte
alter table orders alter column user_id drop not null;

-- L'adresse détaillée n'est plus collectée par défaut (remplacée par ville + commentaire facultatif)
alter table orders alter column address drop not null;

-- Nouveaux champs du formulaire de checkout simplifié
alter table orders add column if not exists first_name text;
alter table orders add column if not exists last_name text;
alter table orders add column if not exists email text;
alter table orders add column if not exists comment text;

-- Note : la création de commande passe désormais par la route serveur
-- /api/orders/create (clé service role, contourne la RLS), donc aucune
-- policy d'insertion supplémentaire n'est nécessaire pour les invités.
-- Les policies de lecture existantes ("Lecture de ses commandes") restent
-- valables pour les commandes rattachées à un compte.
