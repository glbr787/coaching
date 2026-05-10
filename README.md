# Coach Local App

Application web locale pour un coach sportif indépendant.

## Stack
- Frontend : React + Vite
- Backend : Node.js + Express
- Base de données : SQLite locale (`better-sqlite3`)
- Auth locale : session + mot de passe admin
- UI : design system maison (thèmes clair/sombre/système + accent + densité)

## Installation
1. Copier `.env.example` en `.env`
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Initialiser la base locale et les données fictives :
   ```bash
   npm run db:init
   ```

## Lancement
- En développement :
  ```bash
  npm run dev
  ```
- Frontend seul :
  ```bash
  npm run dev:client
  ```
- Backend seul :
  ```bash
  npm run dev:server
  ```

## Structure
- `client/` : frontend React
- `server/` : backend Express
- `prisma/seed.ts` : script de seed local (données fictives)

## Système de thèmes
- Mode clair, sombre et système
- Choix utilisateur stocké en local (`localStorage`)
- Couleur d'accent personnalisable
- Densité d'interface : confortable / compacte
- Variables CSS sémantiques centralisées (`background`, `surface`, `card`, `text`, `muted`, `border`, `accent`, `danger`, `success`, `warning`)

Configuration accessible dans `Paramètres > Apparence`.

## Notes de conception
- Les données sont conçues pour rester locales.
- Les informations sensibles (poids, contraintes physiques, nutrition) sont stockées localement et doivent être protégées.
- Aucun service extérieur, paiement ou SaaS n’est utilisé.

## Limitations actuelles
- Modules de nutrition, mental, rendez-vous et documents préparés mais pas entièrement développés.
- Authentification locale simple uniquement.
- Pas encore d’export CSV/JSON automatique.

## Prochaines évolutions
- Ajout d’un module nutritionnel complet
- Check-ins mentaux
- Export / import
- Sauvegarde locale chiffrée
- UI plus riche et tableaux graphiques
