import bcrypt from 'bcrypt';
import { db } from '../server/src/db.ts';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const password = process.env.ADMIN_PASSWORD || 'changeme';
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = db.prepare('SELECT id FROM users WHERE email = ?').get(email)?.id || randomUUID();

  db.prepare(`INSERT INTO users (id, email, password, role, created_at, updated_at)
    VALUES (?, ?, ?, 'admin', COALESCE((SELECT created_at FROM users WHERE email = ?), datetime('now')), datetime('now'))
    ON CONFLICT(email) DO UPDATE SET password = excluded.password, updated_at = datetime('now')
  `).run(userId, email, hashedPassword, email);

  const clientId = randomUUID();
  db.prepare(`INSERT OR IGNORE INTO clients (
    id, first_name, last_name, email, phone, birth_date, gender, height_cm,
    weight_start, weight_current, main_goal, secondary_goals, level,
    physical_constraints, availability, equipment, status, notes,
    start_date, planned_end_date, consent, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`)
    .run(
      clientId,
      'Clara',
      'Dupont',
      'clara.dupont@example.com',
      '+33 6 12 34 56 78',
      '1991-07-12',
      'Femme',
      168,
      72,
      70.5,
      'Recomposition corporelle',
      'Tonus, mobilité',
      'Intermédiaire',
      'Douleurs lombaires légères',
      'Matin, soirée',
      'Haltères, tapis, élastiques',
      'active',
      'Doit privilégier une reprise progressive.',
      '2026-05-01',
      '2026-08-01',
      1
    );

  const noteId = randomUUID();
  db.prepare('INSERT OR IGNORE INTO client_notes (id, client_id, content, type, created_at) VALUES (?, ?, ?, ?, datetime(\'now\'))')
    .run(noteId, clientId, 'Première séance de bilan réalisée, planifié un programme de force légère.', 'coach-note');

  const exerciseStmt = db.prepare(`INSERT OR IGNORE INTO exercise_library (
    id, name, category, primary_muscle, secondary_muscles,
    equipment, level, instructions, common_mistakes, contraindications, tags,
    created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`);

  exerciseStmt.run(randomUUID(), 'Squat avec poids du corps', 'Force', 'Quadriceps', 'Fessiers, ischio-jambiers', 'Aucun', 'Débutant', 'Descendre en squat en gardant le dos droit.', 'Arrondir le dos, genoux en dedans.', 'Problèmes de genoux graves', 'jambes,bas du corps');
  exerciseStmt.run(randomUUID(), 'Planche avant', 'Gainage', 'Abdominaux', 'Épaules, dos', 'Tapis', 'Intermédiaire', 'Maintenir le corps aligné, contracter le centre.', 'Bassin trop bas ou trop haut.', 'Douleurs au poignet', 'core,stabilité');

  console.log('Seed data chargée. Identifiant admin :', email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
