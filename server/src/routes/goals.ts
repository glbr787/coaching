import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

const router = express.Router();
router.use(requireAuth);

router.put('/:id', (req, res) => {
  const updates = req.body;
  const allowed = [
    'name', 'description', 'category', 'priority', 'startDate', 'targetDate',
    'status', 'metrics', 'notes', 'archivedAt'
  ];
  const fields = allowed.filter((key) => key in updates);

  if (fields.length === 0) {
    return res.status(400).json({ error: 'Aucune donnée valide fournie.' });
  }

  if ('name' in updates && !updates.name) {
    return res.status(400).json({ error: 'Le titre de l’objectif est requis.' });
  }

  if ('category' in updates && !updates.category) {
    return res.status(400).json({ error: 'La catégorie de l’objectif est requise.' });
  }

  if ('priority' in updates) {
    const priority = Number(updates.priority);
    if (![1, 2, 3].includes(priority)) {
      return res.status(400).json({ error: 'Priorité invalide.' });
    }
  }

  if ('status' in updates) {
    const status = updates.status;
    const validStatus = ['active', 'paused', 'achieved', 'abandoned'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ error: 'Statut invalide.' });
    }
  }

  const setClauses = fields.map((field) => {
    if (field === 'archivedAt') {
      return 'archived_at = ?';
    }
    return `${field.replace(/([A-Z])/g, '_$1').toLowerCase()} = ?`;
  });
  const values = fields.map((field) => {
    if (field === 'archivedAt') {
      return updates.archivedAt ? updates.archivedAt : null;
    }
    if (field === 'priority') {
      return Number(updates.priority);
    }
    return updates[field];
  });
  values.push(req.params.id);

  const stmt = db.prepare(`UPDATE client_goals SET ${setClauses.join(', ')}, updated_at = datetime('now') WHERE id = ?`);
  stmt.run(...values);

  const goal = db.prepare('SELECT * FROM client_goals WHERE id = ?').get(req.params.id);
  if (!goal) {
    return res.status(404).json({ error: 'Objectif non trouvé.' });
  }
  res.json(goal);
});

export default router;
