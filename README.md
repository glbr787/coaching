# Coach Local App

Application web locale pour un coach sportif indépendant.

## Stack
- Frontend : React + Vite
- Backend : Node.js + Express
- Base de données : SQLite + Prisma
- Auth locale : session + mot de passe admin

## Installation
1. Copier `.env.example` en `.env`
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Générer Prisma :
   ```bash
   npm run prisma:generate
   ```
4. Créer la base de données :
   ```bash
   npm run migrate:dev
   ```
5. Charger des données fictives :
   ```bash
   npm run seed
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
- `prisma/` : schéma SQLite et seed

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
