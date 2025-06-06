import express from 'express';
import { EntitySchema } from 'typeorm';
import { AppDataSource } from '../appDataSource.js';

const router = express.Router();

// Si tu n’as pas encore de schéma user_choices :
const UserChoice = new EntitySchema({
  name: 'UserChoice',
  tableName: 'user_choices',
  columns: {
    id: { primary: true, type: Number, generated: true },
    user_id: { type: Number },
    movie_id: { type: Number },
    choice: { type: String },
  },
  uniques: [{ columns: ['user_id', 'movie_id'] }],
});

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
