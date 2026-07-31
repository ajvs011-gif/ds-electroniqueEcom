# DS-ELECTRONIQUE

Boutique en ligne de composants électroniques (Arduino, ESP32, capteurs, robotique) pour makers, étudiants et ingénieurs en Côte d'Ivoire et en Afrique de l'Ouest.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (palette et polices DS-ELECTRONIQUE configurées dans `tailwind.config.ts`)
- Framer Motion (slider Hero)
- lucide-react (icônes)

## Démarrer
```bash
npm install
cp .env.local.example .env.local   # puis renseignez vos clés Supabase
npm run dev
```
Puis ouvrir http://localhost:3000

## Configuration Supabase
1. Créez un projet sur [supabase.com](https://supabase.com)
2. Dans l'éditeur SQL, exécutez **dans l'ordre** : `supabase/schema.sql`, `supabase/seed.sql`, `supabase/admin.sql`, `supabase/profile-fields.sql`, `supabase/guest-checkout.sql`
3. Copiez l'URL du projet et la clé `anon public` (Project Settings > API) dans `.env.local`
4. Dans Authentication > Providers, l'authentification Email est activée par défaut

## Emails de commande (client + vous)
- À chaque commande, deux emails partent automatiquement : une **confirmation au client** (récapitulatif, articles, total, ville, paiement) et une **notification à vous** avec toutes les infos saisies au checkout (nom, email, téléphone, ville, commentaire) + le détail de la commande
- Fournisseur : [Resend](https://resend.com) (gratuit jusqu'à 3000 emails/mois)
- Configuration dans `.env.local` : `RESEND_API_KEY`, `EMAIL_FROM`, `ORDER_NOTIFICATION_EMAIL` (voir `.env.local.example` pour le détail)
- Sans clé configurée, l'envoi est simplement ignoré avec un message dans les logs (`[Mode démo]`) — la commande n'échoue jamais à cause d'un problème d'email
- Gabarits dans `lib/email/templates.ts`, logique d'envoi dans `lib/email/send-order-emails.ts`, appelés depuis `/api/orders/create`

## Checkout invité (sans compte obligatoire)
- `/checkout` ne demande plus de connexion : prénom, nom, ville, téléphone, email + un commentaire facultatif suffisent pour commander
- Une case à cocher « Créer un compte » (facultative) ajoute un champ mot de passe ; si cochée, un compte est créé en parallèle et la commande y est rattachée — sinon la commande reste « invité » (`user_id` = null)
- La création de commande passe par la route serveur `/api/orders/create` (clé service role) : elle fonctionne donc aussi bien pour un invité que pour un compte connecté, sans complexité RLS côté client
- Un utilisateur avec compte retrouve ses commandes sur `/commandes` ; un invité reçoit uniquement l'écran de confirmation (pas d'historique sans compte)

### Voir et gérer vos données dans le dashboard Supabase
- **Table Editor** (menu de gauche) : parcourir, ajouter, modifier ou supprimer des lignes dans `products`, `categories`, `orders`, `profiles`... comme un tableur. C'est ici que vous voyez immédiatement les produits ajoutés depuis `/admin/produits` ou les inscriptions.
- **SQL Editor** : lancer des requêtes directement, ex. `select * from products;` ou `select * from auth.users;`
- **Authentication > Users** : liste des comptes inscrits (email, date, confirmé ou non) — distinct de la table `profiles` qui contient les infos métier (nom, téléphone, ville, rôle admin)
- **Storage** : gérer les fichiers du bucket `product-images`
- **Logs** : utile pour déboguer une requête ou un webhook qui échoue

## Catalogue connecté à Supabase
Le catalogue public (`/`, `/produits`, `/produits/[slug]`, `/recherche`, `/favoris`) lit maintenant directement la table Supabase `products` — plus besoin de synchronisation manuelle : tout produit ajouté depuis `/admin/produits` apparaît immédiatement sur le site. `lib/sample-data.ts` ne sert plus que pour les témoignages et le blog (pas encore de table dédiée).

## Structure
- `app/(client)/page.tsx` — page d'accueil
- `app/(client)/produits`, `/produits/[slug]` — catalogue et fiche produit
- `app/(client)/panier`, `/checkout`, `/commandes`, `/commandes/confirmation` — tunnel d'achat (Supabase)
- `app/(client)/favoris` — favoris (localStorage, à migrer vers la table `favorites` si besoin de synchro multi-appareil)
- `app/(client)/connexion`, `/inscription`, `/profil` — authentification Supabase
- `app/(client)/recherche` — recherche dans le catalogue
- `components/` — composants réutilisables (Header, Footer, Hero, ProductCard, CategoryCard, etc.)
- `lib/cart-context.tsx`, `lib/favorites-context.tsx`, `lib/auth-context.tsx` — état global (React Context)
- `lib/supabase/` — clients Supabase (navigateur / serveur) + `middleware.ts` à la racine pour le rafraîchissement de session
- `lib/sample-data.ts` — données d'exemple utilisées par les pages non encore connectées à Supabase (catalogue produit)
- `supabase/schema.sql`, `supabase/seed.sql` — schéma de base de données et données de départ
- `types/index.ts` — types Product, Category, BlogPost, Testimonial, CartLine

## Photos produits
- Chaque produit a un champ `imageUrl` (voir `lib/sample-data.ts` et la colonne `image_url` dans `supabase/seed.sql`)
- Actuellement rempli avec des visuels de substitution stables (`placehold.co`, à vos couleurs) — aucune vraie photo web n'a été utilisée pour éviter les liens cassés ou incertains sur le plan des droits
- Pour mettre vos vraies photos : créez-les dans le bucket Supabase Storage `product-images` (déjà créé par `schema.sql`, lecture publique), puis remplacez `imageUrl` par l'URL Supabase correspondante — le composant `ProductCard`/`ProductDetail` bascule automatiquement sur la vraie image dès qu'elle est renseignée

## Paiement mobile money (Orange Money / MTN MoMo)
- `lib/payments/orange-money.ts` et `mtn-momo.ts` — clients prêts pour les vraies API (OAuth2 + déclenchement du paiement), actuellement en **mode démo** tant que les clés ne sont pas renseignées
- `app/api/payments/initiate` — route appelée par le checkout, qui choisit le bon fournisseur
- `app/api/payments/webhook/orange-money` et `/mtn-momo` — endpoints qui confirmeront automatiquement la commande une fois les fournisseurs configurés (⚠️ à sécuriser avec la vérification de signature du fournisseur avant mise en production)
- Pour activer les vrais paiements : créez un compte marchand sur [developer.orange.com](https://developer.orange.com) et [momodeveloper.mtn.com](https://momodeveloper.mtn.com), puis renseignez les clés dans `.env.local` (voir `.env.local.example`)

## Back-office admin
- Accessible sur `/admin` (redirige vers `/admin/dashboard`) — protégé, réservé aux comptes avec `is_admin = true`
- Après avoir exécuté `schema.sql`, `seed.sql` et **`supabase/admin.sql`** (Phase 5), inscrivez-vous normalement sur le site puis promouvez votre compte en admin :
  ```sql
  update profiles set is_admin = true
  where id = (select id from auth.users where email = 'vous@exemple.com');
  ```
- **Dashboard** : chiffre d'affaires, nombre de commandes/produits/utilisateurs, commandes récentes
- **Produits** : liste, création, édition, suppression (écrit directement dans la table Supabase `products`)
- **Catégories** : liste, création, suppression
- **Commandes** : liste complète avec changement de statut en un clic (en attente → confirmée → expédiée → livrée)
- **Utilisateurs** : liste des comptes inscrits, promotion/rétrogradation du rôle admin
- **Statistiques** : chiffre d'affaires par statut, produits les plus vendus

⚠️ Le back-office admin et le site public partagent maintenant la même table Supabase `products` — tout ce que vous ajoutez ou modifiez dans `/admin/produits` apparaît immédiatement sur le site.

## Prochaines étapes (voir plan en 6 phases)
- Renseigner les vraies clés Orange Money / MTN MoMo dès qu'un compte marchand est disponible
- Phase 6 : SEO, performance, déploiement

# ds-electroniqueEcom
