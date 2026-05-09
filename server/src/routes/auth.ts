import express from 'express';
import { verifyUser, AuthRequest } from '../auth.js';

const router = express.Router();

router.post('/login', async (req: AuthRequest, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  const user = await verifyUser(email, password);
  if (!user) {
    return res.status(401).json({ error: 'Identifiants invalides' });
  }

  if (req.session) {
    req.session.userId = user.id;
  }
  res.json({ email: user.email, role: user.role });
});

router.post('/logout', (req, res) => {
  req.session?.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.json({ ok: true });
  });
});

router.get('/me', (req: AuthRequest, res) => {
  if (req.session?.userId) {
    return res.json({ userId: req.session.userId });
  }
  return res.status(401).json({ error: 'Unauthorized' });
});

export default router;
