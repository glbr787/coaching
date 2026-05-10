import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';
import { randomUUID } from 'crypto';

const router = express.Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const clients = db.prepare('SELECT * FROM clients WHERE deleted_at IS NULL ORDER BY updated_at DESC').all();
  res.json(clients);
});

router.post('/', (req, res) => {
  const data = req.body;
  const id = randomUUID();
  const stmt = db.prepare(`INSERT INTO clients (
    id, first_name, last_name, email, phone, birth_date, gender, height_cm,
    weight_start, weight_current, main_goal, secondary_goals, level,
    physical_constraints, availability, equipment, status, notes,
    start_date, planned_end_date, consent, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`);

  stmt.run(
    id,
    data.firstName || '',
    data.lastName || '',
    data.email || null,
    data.phone || null,
    data.birthDate || null,
    data.gender || null,
    data.heightCm ?? null,
    data.weightStart ?? null,
    data.weightCurrent ?? null,
    data.mainGoal || null,
    data.secondaryGoals || null,
    data.level || null,
    data.physicalConstraints || null,
    data.availability || null,
    data.equipment || null,
    data.status || 'active',
    data.notes || null,
    data.startDate || null,
    data.plannedEndDate || null,
    data.consent ? 1 : 0
  );

  const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(id);
  res.status(201).json(client);
});

router.get('/:id', (req, res) => {
  const client = db.prepare('SELECT * FROM clients WHERE id = ? AND deleted_at IS NULL').get(req.params.id);
  if (!client) {
    return res.status(404).json({ error: 'Client non trouvé' });
  }

  const notes = db.prepare('SELECT * FROM client_notes WHERE client_id = ? ORDER BY created_at DESC').all(req.params.id);
  const programs = db.prepare('SELECT * FROM programs WHERE client_id = ? ORDER BY updated_at DESC').all(req.params.id);
  const goals = db.prepare('SELECT * FROM client_goals WHERE client_id = ? ORDER BY updated_at DESC').all(req.params.id);
  const metrics = db.prepare('SELECT * FROM client_metrics WHERE client_id = ? ORDER BY date DESC').all(req.params.id);

  res.json({ ...client, notesList: notes, programs, goals, metrics });
});

router.get('/:id/goals', (req, res) => {
  const goals = db.prepare('SELECT * FROM client_goals WHERE client_id = ? ORDER BY updated_at DESC').all(req.params.id);
  res.json(goals);
});

router.post('/:id/goals', (req, res) => {
  const { name, description, category, priority, startDate, targetDate, status, metrics, notes } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: 'Le titre et la catégorie de l’objectif sont requis.' });
  }

  const validStatus = ['active', 'paused', 'achieved', 'abandoned'];
  if (status && !validStatus.includes(status)) {
    return res.status(400).json({ error: 'Statut d’objectif invalide.' });
  }

  const parsedPriority = Number(priority);
  if (priority !== undefined && ![1, 2, 3].includes(parsedPriority)) {
    return res.status(400).json({ error: 'Priorité d’objectif invalide.' });
  }

  const id = randomUUID();
  db.prepare(`INSERT INTO client_goals (
    id, client_id, name, description, category, priority, start_date,
    target_date, status, metrics, notes, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`).run(
    id,
    req.params.id,
    name,
    description || null,
    category,
    parsedPriority || 2,
    startDate || null,
    targetDate || null,
    status || 'active',
    metrics || null,
    notes || null
  );

  const goal = db.prepare('SELECT * FROM client_goals WHERE id = ?').get(id);
  res.status(201).json(goal);
});

router.get('/:id/metrics', (req, res) => {
  const metrics = db.prepare('SELECT * FROM client_metrics WHERE client_id = ? ORDER BY date DESC').all(req.params.id);
  res.json(metrics);
});

router.post('/:id/metrics', (req, res) => {
  const {
    date,
    weight,
    waist,
    chest,
    hips,
    arm,
    thigh,
    bodyFatPercentage,
    restingHeartRate,
    energyLevel,
    sleepQuality,
    notes
  } = req.body;

  if (!date) {
    return res.status(400).json({ error: 'La date de la mesure est requise.' });
  }

  const parsedEnergy = energyLevel !== undefined ? Number(energyLevel) : null;
  const parsedSleep = sleepQuality !== undefined ? Number(sleepQuality) : null;
  if (parsedEnergy !== null && (parsedEnergy < 1 || parsedEnergy > 10)) {
    return res.status(400).json({ error: 'Le niveau d’énergie doit être entre 1 et 10.' });
  }
  if (parsedSleep !== null && (parsedSleep < 1 || parsedSleep > 10)) {
    return res.status(400).json({ error: 'La qualité de sommeil doit être entre 1 et 10.' });
  }

  const id = randomUUID();
  db.prepare(`INSERT INTO client_metrics (
    id, client_id, date, weight, waist, chest, hips, arm, thigh,
    body_fat_percentage, resting_heart_rate, energy_level, sleep_quality,
    notes, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`).run(
    id,
    req.params.id,
    date,
    weight ?? null,
    waist ?? null,
    chest ?? null,
    hips ?? null,
    arm ?? null,
    thigh ?? null,
    bodyFatPercentage ?? null,
    restingHeartRate ?? null,
    parsedEnergy,
    parsedSleep,
    notes || null
  );

  const metric = db.prepare('SELECT * FROM client_metrics WHERE id = ?').get(id);
  res.status(201).json(metric);
});

router.put('/:id', (req, res) => {
  const updates = req.body;
  const allowed = [
    'firstName', 'lastName', 'email', 'phone', 'birthDate', 'gender', 'heightCm',
    'weightStart', 'weightCurrent', 'mainGoal', 'secondaryGoals', 'level',
    'physicalConstraints', 'availability', 'equipment', 'status', 'notes',
    'startDate', 'plannedEndDate', 'consent'
  ];

  const fields = allowed.filter((key) => key in updates);
  if (fields.length === 0) {
    return res.status(400).json({ error: 'Aucune donnée valide fournie.' });
  }

  const setClauses = fields.map((field) => {
    const column = field.replace(/([A-Z])/g, '_$1').toLowerCase();
    return `${column} = ?`;
  });
  const values = fields.map((field) => (field === 'consent' ? (updates[field] ? 1 : 0) : updates[field]));
  values.push(req.params.id);

  const stmt = db.prepare(`UPDATE clients SET ${setClauses.join(', ')}, updated_at = datetime('now') WHERE id = ? AND deleted_at IS NULL`);
  stmt.run(...values);

  const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id);
  res.json(client);
});

router.delete('/:id', (req, res) => {
  db.prepare('UPDATE clients SET deleted_at = datetime(\'now\') WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

router.get('/:id/notes', (req, res) => {
  const notes = db.prepare('SELECT * FROM client_notes WHERE client_id = ? ORDER BY created_at DESC').all(req.params.id);
  res.json(notes);
});

router.post('/:id/notes', (req, res) => {
  const id = randomUUID();
  db.prepare('INSERT INTO client_notes (id, client_id, content) VALUES (?, ?, ?)')
    .run(id, req.params.id, req.body.content || '');

  const note = db.prepare('SELECT * FROM client_notes WHERE id = ?').get(id);
  res.status(201).json(note);
});

export default router;
