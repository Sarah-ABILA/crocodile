# 🐊 Crocodile — Qui paye ?

> Application web multi-joueurs **temps réel** pour décider de manière fun qui paie l'addition (ou n'importe quoi d'autre). Un host crée une session, ses amis rejoignent avec un code à 5 caractères, le tirage est synchronisé en live.

[![Live demo](https://img.shields.io/badge/Live_demo-crocodile--ochre.vercel.app-2E7D32?logo=vercel&logoColor=white)](https://crocodile-ochre.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

🌐 **Démo en ligne** : https://crocodile-ochre.vercel.app

---

## Le concept

Vous êtes au restaurant, autour d'un verre, ou en train de débattre de qui sort la poubelle. Crocodile règle le débat en 30 secondes :

1. L'**hôte** crée une session, ajoute les noms des participants (jusqu'à 12).
2. Un **code à 5 caractères** est généré et partagé avec le groupe.
3. Les autres participants **rejoignent** avec ce code depuis leur propre téléphone.
4. L'hôte lance le **tirage au sort** : le résultat est diffusé en temps réel à tout le monde via Supabase Realtime.
5. Le perdant est révélé avec une animation crocodile maison 🐊.

Un historique local conserve les derniers tirages.

## Stack technique

| Couche | Choix |
|---|---|
| **Framework** | React 18 |
| **Build** | Vite 5 |
| **Synchronisation temps réel** | Supabase Realtime (canal `postgres_changes` sur la table `sessions`) |
| **Persistence** | Supabase (PostgreSQL côté serveur) + `localStorage` côté client pour l'historique |
| **PWA** | `vite-plugin-pwa` (manifest, service worker, installation sur écran d'accueil) |
| **Linting** | ESLint 9 |
| **Animation** | SVG custom (mascotte crocodile vectorielle) |
| **Hébergement** | Vercel |

## Architecture

```
Host (création session)              Participants (rejoindre par code)
       │                                            │
       ▼                                            ▼
┌──────────────────────────────────────────────────────────────┐
│            Supabase — table sessions                          │
│   id (code) · names · status · loser                          │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
        Postgres Changes (Realtime)
                     │
                     ▼
       ┌─────────────────────────────┐
       │ Tous les clients connectés  │
       │ reçoivent l'update en live  │
       └─────────────────────────────┘
```

Quand le host appelle `lancerTirage`, le client met à jour la ligne `sessions` côté Supabase. Tous les autres clients abonnés au canal reçoivent la nouvelle valeur de `loser` instantanément, sans polling.

## Lancer le projet localement

Prérequis : **Node 20+**, un projet Supabase avec une table `sessions` (colonnes `id`, `names`, `status`, `loser`).

```bash
git clone https://github.com/Sarah-ABILA/crocodile.git
cd crocodile

npm install

# Créer .env.local
cat > .env.local <<EOF
VITE_SUPABASE_URL=https://VOTRE-PROJET.supabase.co
VITE_SUPABASE_ANON_KEY=VOTRE_CLE_ANON
EOF

npm run dev
```

Disponible sur `http://localhost:5173`.

## Déploiement

Le projet est déployé sur **Vercel** avec une intégration GitHub continue. Chaque push sur `main` déclenche un build et une mise en ligne automatiques. Les variables d'environnement Supabase sont configurées dans le dashboard Vercel.

## Ce que j'ai appris en construisant Crocodile

- **Synchroniser un état partagé en temps réel** entre plusieurs clients sans serveur custom (Supabase Realtime fait le travail).
- **Gérer le rôle host/participant** dans une UI simple (qui peut lancer le tirage, qui ne peut que regarder).
- **Concevoir un PWA installable** (manifest, service worker, icônes adaptatives).
- **Dessiner du SVG vectoriel à la main** pour une mascotte personnalisée animée par les états React.
- **Déployer en continu sur Vercel** avec gestion des secrets côté plateforme.

## Roadmap (envies futures)

- Mode équipes (deux camps qui s'affrontent)
- Autres règles de tirage (1 vs tous, vote secret)
- Partage du résultat sur les réseaux (image générée à la volée)
- Historique partagé entre devices via un compte utilisateur

---

_Sarah Abila — Hyères (83) — [LinkedIn](https://linkedin.com/in/sarah-abila-278041378) — [GitHub](https://github.com/Sarah-ABILA)_
