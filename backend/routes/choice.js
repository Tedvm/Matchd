import express from 'express';
import { AppDataSource } from '../appDataSource.js';
import UserChoice from '../entities/choice.js';

const router = express.Router();

// POST /api/user-choice
router.post('/user-choice', async (req, res) => {
  const { userId, movieId, choice } = req.body;

  if (!['like', 'dislike'].includes(choice)) {
    return res.status(400).json({ error: 'Choix invalide' });
  }

  try {
    const repo = AppDataSource.getRepository(UserChoice);

    // Vérifie si l'utilisateur a déjà un avis
    const existing = await repo.findOneBy({
      user_id: userId,
      movie_id: movieId,
    });

    if (existing) {
      existing.choice = choice;
      await repo.save(existing);
    } else {
      await repo.save({ user_id: userId, movie_id: movieId, choice });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Erreur enregistrement choix :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
