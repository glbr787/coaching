import Database from 'better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.DATABASE_URL || 'file:./dev.db';
const dbFile = url.startsWith('file:') ? url.replace(/^file:\/\//, '').replace(/^file:/, '') : url;
const db: Database.Database = new Database(dbFile);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  coach_name TEXT,
  business_name TEXT,
  email TEXT,
  phone TEXT,
  disclaimer TEXT,
  nutrition_advice TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  birth_date TEXT,
  gender TEXT,
  height_cm INTEGER,
  weight_start REAL,
  weight_current REAL,
  main_goal TEXT,
  secondary_goals TEXT,
  level TEXT,
  physical_constraints TEXT,
  availability TEXT,
  equipment TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  start_date TEXT,
  planned_end_date TEXT,
  consent INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS client_goals (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  priority INTEGER NOT NULL DEFAULT 2,
  start_date TEXT,
  target_date TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  metrics TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS programs (
  id TEXT PRIMARY KEY,
  client_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  duration_weeks INTEGER,
  sessions_per_week INTEGER,
  goal TEXT,
  level TEXT,
  equipment TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS exercise_library (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  primary_muscle TEXT,
  secondary_muscles TEXT,
  equipment TEXT,
  level TEXT,
  instructions TEXT,
  common_mistakes TEXT,
  contraindications TEXT,
  tags TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS client_notes (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'note',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS workout_logs (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  session_date TEXT NOT NULL,
  exercises_done TEXT,
  comment_coach TEXT,
  comment_client TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS nutrition_profiles (
  id TEXT PRIMARY KEY,
  client_id TEXT UNIQUE NOT NULL,
  target_calories INTEGER,
  target_protein INTEGER,
  target_carbs INTEGER,
  target_fats INTEGER,
  meals_per_day INTEGER,
  preferences TEXT,
  exclusions TEXT,
  allergies TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS nutrition_logs (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL,
  date TEXT NOT NULL,
  weight REAL,
  calories INTEGER,
  protein INTEGER,
  hydration INTEGER,
  sleep INTEGER,
  hunger INTEGER,
  energy INTEGER,
  digestion TEXT,
  compliance TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(profile_id) REFERENCES nutrition_profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mental_profiles (
  id TEXT PRIMARY KEY,
  client_id TEXT UNIQUE NOT NULL,
  goal TEXT,
  motivation INTEGER,
  stress INTEGER,
  confidence INTEGER,
  discipline INTEGER,
  blocks TEXT,
  routines TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mental_checkins (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL,
  date TEXT NOT NULL,
  motivation INTEGER,
  stress INTEGER,
  confidence INTEGER,
  sleep INTEGER,
  comment TEXT,
  action_priority TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(profile_id) REFERENCES mental_profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ebooks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  objective TEXT,
  level TEXT,
  price REAL,
  file_path TEXT,
  cover_path TEXT,
  tags TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ebook_recommendations (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  ebook_id TEXT NOT NULL,
  sent INTEGER NOT NULL DEFAULT 0,
  sent_at TEXT,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY(ebook_id) REFERENCES ebooks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  date TEXT NOT NULL,
  type TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  summary TEXT,
  action TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  client_id TEXT,
  file_path TEXT NOT NULL,
  label TEXT,
  type TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE SET NULL
);
`);

const ensureSettings = db.prepare('INSERT OR IGNORE INTO settings (id, coach_name, business_name, email, phone, disclaimer, nutrition_advice) VALUES (1, ?, ?, ?, ?, ?, ?)');
ensureSettings.run(
  'Coach Local',
  'Studio Coach',
  'contact@example.com',
  '+33 0 00 00 00 00',
  'Aucun conseil nutritionnel ou médical n\'est fourni par cette application locale.',
  'Ces informations sont destinées au suivi personnel et ne remplacent pas un avis professionnel.'
);

export { db };
