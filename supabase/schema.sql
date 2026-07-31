-- =========================================================
-- DS-ELECTRONIQUE — Schéma Supabase (Phase 4)
-- À exécuter dans l'éditeur SQL de votre projet Supabase
-- =========================================================

-- ---------- CATÉGORIES ----------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text not null default 'Cpu',
  created_at timestamptz not null default now()
);

-- ---------- PRODUITS ----------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  price_fcfa integer not null check (price_fcfa >= 0),
  old_price_fcfa integer check (old_price_fcfa >= 0),
  badge text,
  rating numeric(2,1) not null default 0 check (rating between 0 and 5),
  stock text not null default 'en_stock' check (stock in ('en_stock','stock_limite','rupture')),
  icon text not null default 'Cpu',
  category_slug text not null references categories(slug) on update cascade,
  short_description text not null default '',
  description text not null default '',
  specs jsonb not null default '[]',
  image_url text,
  created_at timestamptz not null default now()
);
create index if not exists products_category_idx on products(category_slug);

-- ---------- PROFILS (1-1 avec auth.users) ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  city text,
  created_at timestamptz not null default now()
);

-- Crée automatiquement un profil quand un utilisateur s'inscrit
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- FAVORIS ----------
create table if not exists favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- ---------- COMMANDES ----------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'en_attente'
    check (status in ('en_attente','confirmee','expediee','livree','annulee')),
  subtotal_fcfa integer not null,
  livraison_fcfa integer not null default 2000,
  remise_fcfa integer not null default 0,
  total_fcfa integer not null,
  full_name text not null,
  phone text not null,
  city text not null,
  address text not null,
  payment_method text not null check (payment_method in ('orange_money','mtn_momo','carte','paiement_livraison')),
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  product_name text not null,
  quantity integer not null check (quantity > 0),
  price_fcfa integer not null
);

-- =========================================================
-- RLS (Row Level Security)
-- =========================================================
alter table categories enable row level security;
alter table products enable row level security;
alter table profiles enable row level security;
alter table favorites enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Catégories / produits : lecture publique
create policy "Lecture publique des catégories" on categories for select using (true);
create policy "Lecture publique des produits" on products for select using (true);

-- Profils : chacun voit et modifie uniquement le sien
create policy "Lecture de son propre profil" on profiles for select using (auth.uid() = id);
create policy "Mise à jour de son propre profil" on profiles for update using (auth.uid() = id);

-- Favoris : chacun gère uniquement les siens
create policy "Lecture de ses favoris" on favorites for select using (auth.uid() = user_id);
create policy "Ajout de ses favoris" on favorites for insert with check (auth.uid() = user_id);
create policy "Suppression de ses favoris" on favorites for delete using (auth.uid() = user_id);

-- Commandes : chacun gère uniquement les siennes
create policy "Lecture de ses commandes" on orders for select using (auth.uid() = user_id);
create policy "Création de ses commandes" on orders for insert with check (auth.uid() = user_id);

create policy "Lecture des lignes de ses commandes" on order_items for select
  using (exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));
create policy "Création des lignes de ses commandes" on order_items for insert
  with check (exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));

-- =========================================================
-- STORAGE : bucket pour les vraies photos produits
-- =========================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Lecture publique des photos produits"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Seuls les comptes marqués admin (Phase 5) pourront uploader/modifier ;
-- en attendant le back-office, l'upload se fait depuis le Dashboard Supabase.
