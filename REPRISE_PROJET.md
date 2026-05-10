# REPRISE PROJET

## 1. Contexte du projet

- Application locale pour coach sportif.
- Prototype developpe pour fonctionner d'abord en local.
- Objectif: suivi clients, programmes, notes, exercices, puis evolutions futures vers objectifs, mesures, nutrition, mental, ebooks.
- Le projet n'est pas encore pret pour une vraie production avec donnees clients reelles.

## 2. Stack technique

- Frontend React + Vite.
- Backend Node.js + Express.
- Base SQLite locale.
- Prisma ORM.
- Auth admin locale.
- Themes clair/sombre/systeme.
- UI inspiree macOS/iOS moderne sans copie de marque.


## 3. Etat actuel fonctionnel

- vitrine publique moderne (landing page);
- lien admin discret en footer;
- login admin local;
- dashboard basique;
- CRUD clients;
- recherche et filtres clients;
- edition client;
- fiche client;
- notes client;
- programmes simples;
- bibliotheque d'exercices;
- theme clair/sombre/systeme;
- accent et densite;
- README de reprise Windows/macOS;
- compatibilite chemins Windows/macOS;
- fichiers SQLite et .env ignores.


## 4. Identifiants de demonstration

- Email: admin@example.com
- Mot de passe: changeme

Ces identifiants doivent etre changes avant tout usage reel.

### URLs au lancement local
- Vitrine publique: http://localhost:5173
- Admin (lien en bas a droite du footer): http://localhost:5173/login
- Backend API: http://localhost:4000
## 5. Commandes de reprise

### macOS/Linux

```bash
git clone <url-du-depot>
cd coaching
npm install
cp .env.example .env
npm run prisma:generate
npm run migrate:deploy
npm run seed
npm run dev
```

### Windows PowerShell

```powershell
git clone <url-du-depot>
cd coaching
npm install
Copy-Item .env.example .env
npm run prisma:generate
npm run migrate:deploy
npm run seed
npm run dev
```

## 6. Points de vigilance

- Ne jamais versionner .env.
- Ne jamais versionner dev.db, dev.db-wal, dev.db-shm, *.db, *.sqlite.
- Ne pas utiliser de donnees clients reelles tant que la securite n'est pas durcie.
- SQLite local adapte au prototype local, pas a une vraie production web.
- Pas de chiffrement complet de la base.
- Pas de sauvegarde automatique.
- Pas de conformite RGPD complete.
- Pas d'email, paiement, cloud ou API externe pour l'instant.

## 7. Regles pour le prochain developpeur / Copilot

- Ne pas changer de stack sans raison forte.
- Ne pas refondre tout le projet.
- Ne pas casser la Phase 1.
- Privilegier des petits changements testables.
- Lancer npm run build apres modification.
- Verifier git status --short avant commit.
- Ne pas ajouter de dependances lourdes inutilement.
- Garder la compatibilite Windows/macOS.
- Utiliser des chemins relatifs et node:path si necessaire.
- Proteger les routes API derriere l'auth existante.

## 8. Prochaines etapes recommandees

### Phase 2A

- objectifs clients;
- mesures de progression simples;
- integration fiche client;
- dashboard leger.

### Phase 2B

- suivi des seances realisees;
- historique de progression.

### Phase 2C

- nutrition simple;
- avertissements non medicaux.

### Phase 2D

- preparation mentale;
- check-ins motivation/stress/sommeil.

### Phase 3

- ebooks;
- recommandations;
- export CSV/JSON;
- sauvegarde locale.

## 9. Hors perimetre actuel

- pas de mise en ligne production;
- pas de paiement;
- pas d'email;
- pas de multi-utilisateur avance;
- pas d'analytics complexes;
- pas de refonte complete UI.

## 10. Derniers commits importants

- ad299bf chore: stabilize local coach app phase 1
- be9561e chore: prepare project handoff
