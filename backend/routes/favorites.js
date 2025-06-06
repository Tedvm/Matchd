// backend/routes/favorites.js
import express from 'express';
import { In } from 'typeorm';
import { appDataSource } from '../datasource.js';
import User from '../entities/user.js';

const router = express.Router();

router.get('/', function (req, res) {
  const userRepository = appDataSource.getRepository(User);

  userRepository
    .findOne({ where: { id: req.user.id } })
    .then(function (me) {
      if (!me) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // me.favorites est un string[], ex. ["3","7","12"]
      const favIds = me.favorites
        .map((s) => parseInt(s, 10))
        .filter((n) => !isNaN(n));

      if (favIds.length === 0) {
        return res.json({ favorites: [] });
      }

      userRepository
        .find({ where: { id: In(favIds) } })
        .then(function (favorites) {
          res.json({ favorites: favorites });
        })
        .catch(function (error) {
          console.error(error);
          res
            .status(500)
            .json({ message: 'Erreur serveur lors de la récupération des favoris' });
        });
    })
    .catch(function (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Erreur serveur lors de la récupération de l’utilisateur' });
    });
});

export default router;
