import bcrypt from 'bcrypt';
import express from 'express';
import type { Session } from 'express-session';
import { db } from './db.js';

interface AuthSession extends Session {
  userId?: string;
}

export interface AuthRequest extends express.Request {
  session: AuthSession;
  userId?: string;
}

export async function verifyUser(email: string, password: string) {
  const user = db.prepare('SELECT id, email, password, role FROM users WHERE email = ?').get(email) as { id: string; email: string; password: string; role: string } | undefined;
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.password);
  return valid ? user : null;
}

export function requireAuth(req: AuthRequest, res: express.Response, next: express.NextFunction) {
  if (req.session?.userId) {
    req.userId = req.session.userId;
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
}
