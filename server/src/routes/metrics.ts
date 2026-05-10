import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

const router = express.Router();
router.use(requireAuth);

router.put('/:id', (req, res) => {
  const updates = req.body;
  const allowed = [
    'date', 'weight', 'waist', 'chest', 'hips', 'arm', 'thigh',
    'bodyFatPercentage', 'restingHeartRate', 'energyLevel', 'sleepQuality', 'notes'
  ];
  const fields = allowed.filter((key) => key in updates);

  if (fields.length === 0) {
    return res.status(400).json({ error: 'Aucune donnée valide fournie.' });
  }

  if ('date' in updates && !updates.date) {
    return res.status(400).json({ error: 'La date de la mesure est requise.' });
  }

  if ('energyLevel' in updates) {
    const value = Number(updates.energyLevel);
    if (value < 1 || value > 10) {
      return res.status(400).json({ error: 'Le niveau d’énergie doit être entre 1 et 10.' });
    }
  }

  if ('sleepQuality' in updates) {
    const value = Number(updates.sleepQuality);
    if (value < 1 || value > 10) {
      return res.status(400).json({ error: 'La qualité du sommeil doit être entre 1 et 10.' });
    }
  }

  const setClauses = fields.map((field) => `${field.replace(/([A-Z])/g, '_$1').toLowerCase()} = ?`);
  const values = fields.map((field) => {
    if (['weight', 'waist', 'chest', 'hips', 'arm', 'thigh', 'bodyFatPercentage'].includes(field)) {
      return updates[field] === undefined || updates[field] === '' ? null : Number(updates[field]);
    }
    if (['restingHeartRate', 'energyLevel', 'sleepQuality'].includes(field)) {
      return updates[field] === undefined || updates[field] === '' ? null : Number(updates[field]);
    }
    return updates[field];
  });
  values.push(req.params.id);

  const stmt = db.prepare(`UPDATE client_metrics SET ${setClauses.join(', ')}, updated_at = datetime('now') WHERE id = ?`);
  stmt.run(...values);

  const metric = db.prepare('SELECT * FROM client_metrics WHERE id = ?').get(req.params.id);
  if (!metric) {
    return res.status(404).json({ error: 'Mesure non trouvée.' });
  }
  res.json(metric);
});

router.delete('/:id', (req, res) => {
  const metric = db.prepare('SELECT id FROM client_metrics WHERE id = ?').get(req.params.id);
  if (!metric) {
    return res.status(404).json({ error: 'Mesure non trouvée.' });
  }
  db.prepare('DELETE FROM client_metrics WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;
