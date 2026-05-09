import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import clientRoutes from './routes/clients.js';
import programRoutes from './routes/programs.js';
import exerciseRoutes from './routes/exercises.js';
import dashboardRoutes from './routes/dashboard.js';
import settingsRoutes from './routes/settings.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 24 }
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/ping', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Une erreur serveur est survenue.' });
});

app.listen(port, () => {
  console.log(`Server ready at http://localhost:${port}`);
});
