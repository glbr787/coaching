import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';
import { randomUUID } from 'crypto';

const router = express.Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const programs = db.prepare('SELECT * FROM programs ORDER BY updated_at DESC').all();
  res.json(programs);
});

router.post('/', (req, res) => {
  const id = randomUUID();
  db.prepare(`INSERT INTO programs (
    id, client_id, name, description, duration_weeks,
    sessions_per_week, goal, level, equipment, notes, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`)
    .run(
      id,
      req.body.clientId || null,
      req.body.name || 'Programme',
      req.body.description || null,
      req.body.durationWeeks ?? null,
      req.body.sessionsPerWeek ?? null,
      req.body.goal || null,
      req.body.level || null,
      req.body.equipment || null,
      req.body.notes || null
    );

  const program = db.prepare('SELECT * FROM programs WHERE id = ?').get(id);
  res.status(201).json(program);
});

router.get('/:id', (req, res) => {
  const program = db.prepare('SELECT * FROM programs WHERE id = ?').get(req.params.id);
  if (!program) {
    return res.status(404).json({ error: 'Programme non trouvé' });
  }
  res.json(program);
});

router.put('/:id', (req, res) => {
  const updates = req.body;
  const allowed = ['name','description','durationWeeks','sessionsPerWeek','goal','level','equipment','notes','clientId'];
  const fields = allowed.filter((key) => key in updates);
  if (fields.length === 0) {
    return res.status(400).json({ error: 'Aucune donnée valide fournie.' });
  }

  const setClauses = fields.map((field) => {
    const column = field.replace(/([A-Z])/g, '_$1').toLowerCase();
    return `${column} = ?`;
  });
  const values = fields.map((field) => updates[field]);
  values.push(req.params.id);

  db.prepare(`UPDATE programs SET ${setClauses.join(', ')}, updated_at = datetime('now') WHERE id = ?`).run(...values);
  const program = db.prepare('SELECT * FROM programs WHERE id = ?').get(req.params.id);
  res.json(program);
});

export default router;
