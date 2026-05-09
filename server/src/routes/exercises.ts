import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';
import { randomUUID } from 'crypto';

const router = express.Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const exercises = db.prepare('SELECT * FROM exercise_library ORDER BY name ASC').all();
  res.json(exercises);
});

router.post('/', (req, res) => {
  const id = randomUUID();
  db.prepare(`INSERT INTO exercise_library (
    id, name, category, primary_muscle, secondary_muscles,
    equipment, level, instructions, common_mistakes, contraindications, tags,
    created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`)
    .run(
      id,
      req.body.name || 'Nouvel exercice',
      req.body.category || null,
      req.body.primaryMuscle || null,
      req.body.secondaryMuscles || null,
      req.body.equipment || null,
      req.body.level || null,
      req.body.instructions || null,
      req.body.commonMistakes || null,
      req.body.contraindications || null,
      req.body.tags || null
    );

  const exercise = db.prepare('SELECT * FROM exercise_library WHERE id = ?').get(id);
  res.status(201).json(exercise);
});

router.get('/:id', (req, res) => {
  const exercise = db.prepare('SELECT * FROM exercise_library WHERE id = ?').get(req.params.id);
  if (!exercise) {
    return res.status(404).json({ error: 'Exercice non trouvé' });
  }
  res.json(exercise);
});

router.put('/:id', (req, res) => {
  const updates = req.body;
  const allowed = [
    'name', 'category', 'primaryMuscle', 'secondaryMuscles', 'equipment',
    'level', 'instructions', 'commonMistakes', 'contraindications', 'tags'
  ];
  const fields = allowed.filter((key) => key in updates);
  if (fields.length === 0) {
    return res.status(400).json({ error: 'Aucune donnée valide fournie.' });
  }
  const setClauses = fields.map((field) => field.replace(/([A-Z])/g, '_$1').toLowerCase() + ' = ?');
  const values = fields.map((field) => updates[field]);
  values.push(req.params.id);

  db.prepare(`UPDATE exercise_library SET ${setClauses.join(', ')}, updated_at = datetime('now') WHERE id = ?`).run(...values);
  const exercise = db.prepare('SELECT * FROM exercise_library WHERE id = ?').get(req.params.id);
  res.json(exercise);
});

export default router;
