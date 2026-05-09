import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as count FROM clients WHERE deleted_at IS NULL').get() as { count: number };
  const active = db.prepare('SELECT COUNT(*) as count FROM clients WHERE status = ? AND deleted_at IS NULL').get('active') as { count: number };
  const paused = db.prepare('SELECT COUNT(*) as count FROM clients WHERE status = ? AND deleted_at IS NULL').get('pause') as { count: number };
  const programs = db.prepare('SELECT COUNT(*) as count FROM programs').get() as { count: number };
  const nutritionActive = db.prepare('SELECT COUNT(*) as count FROM nutrition_profiles').get() as { count: number };
  const recentNotes = db.prepare('SELECT n.*, c.first_name, c.last_name FROM client_notes n JOIN clients c ON n.client_id = c.id ORDER BY n.created_at DESC LIMIT 5').all();
  const topGoals = db.prepare('SELECT name, COUNT(*) as count FROM client_goals GROUP BY name ORDER BY count DESC LIMIT 5').all();

  res.json({
    totalClients: total.count,
    activeClients: active.count,
    pausedClients: paused.count,
    programsCount: programs.count,
    nutritionProfiles: nutritionActive.count,
    recentNotes,
    topGoals
  });
});

export default router;
