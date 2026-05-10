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
  const activeGoals = db.prepare('SELECT COUNT(*) as count FROM client_goals WHERE archived_at IS NULL AND status = ?').get('active') as { count: number };
  const achievedGoals = db.prepare('SELECT COUNT(*) as count FROM client_goals WHERE archived_at IS NULL AND status = ?').get('achieved') as { count: number };
  const clientsWithoutRecentMetrics = db.prepare(
    `SELECT COUNT(*) as count FROM clients c
     WHERE deleted_at IS NULL
       AND NOT EXISTS (
         SELECT 1 FROM client_metrics m
         WHERE m.client_id = c.id
           AND date(m.date) >= date('now', '-30 days')
       )`
  ).get() as { count: number };
  const recentNotes = db.prepare('SELECT n.*, c.first_name, c.last_name FROM client_notes n JOIN clients c ON n.client_id = c.id ORDER BY n.created_at DESC LIMIT 5').all();
  const topGoals = db.prepare('SELECT name, COUNT(*) as count FROM client_goals WHERE archived_at IS NULL GROUP BY name ORDER BY count DESC LIMIT 5').all();
  const recentGoals = db.prepare(
    `SELECT g.id, g.name, g.status, g.category, c.first_name, c.last_name
     FROM client_goals g
     JOIN clients c ON g.client_id = c.id
     WHERE g.archived_at IS NULL
     ORDER BY g.created_at DESC
     LIMIT 5`
  ).all();

  res.json({
    totalClients: total.count,
    activeClients: active.count,
    pausedClients: paused.count,
    programsCount: programs.count,
    nutritionProfiles: nutritionActive.count,
    activeGoals: activeGoals.count,
    achievedGoals: achievedGoals.count,
    clientsWithoutRecentMetrics: clientsWithoutRecentMetrics.count,
    recentNotes,
    topGoals,
    recentGoals
  });
});

export default router;
