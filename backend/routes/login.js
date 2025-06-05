import express from 'express';
import { appDataSource } from '../datasource.js';
import User from '../entities/user.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et password requis' });
  }

  try {
    const userRepo = appDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Email ou mot de passe invalide' });
    }

    // Connexion réussie : on renvoie les infos publiques
    return res.json({
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
    });
  } catch (err) {
    console.error('Login error:', err);

    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
