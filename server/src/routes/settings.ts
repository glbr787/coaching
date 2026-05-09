import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const settings = db.prepare('SELECT * FROM settings WHERE id = 1').get();
  res.json(settings);
});

router.put('/', (req, res) => {
  const updates = req.body;
  const allowed = ['coachName', 'businessName', 'email', 'phone', 'disclaimer', 'nutritionAdvice'];
  const fields = allowed.filter((key) => key in updates);
  if (fields.length === 0) {
    return res.status(400).json({ error: 'Aucune donnée valide fournie.' });
  }

  const setClauses = fields.map((field) => field.replace(/([A-Z])/g, '_$1').toLowerCase() + ' = ?');
  const values = fields.map((field) => updates[field]);
  values.push(1);
  db.prepare(`UPDATE settings SET ${setClauses.join(', ')}, updated_at = datetime('now') WHERE id = ?`).run(...values);
  const settings = db.prepare('SELECT * FROM settings WHERE id = 1').get();
  res.json(settings);
});

export default router;
