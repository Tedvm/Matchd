// backend/routes/favorites.js
import express from 'express';
import { appDataSource } from '../datasource.js';
import User from '../entities/user.js';

const router = express.Router();

// GET /favorites
// Récupère la liste des utilisateurs favoris de l’utilisateur connecté
router.get('/', function (req, res) {
  const currentUser = req.user; // on suppose qu’un middleware auth a placé l’objet User dans req.user
  appDataSource
    .getRepository(User)
    .findOne({
      where: { id: currentUser.id },
    })
    .then((me) => {
      if (!me) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      // me.favorites est une simple-array de chaînes, ex. ["3","7","12"]
      const favIds = me.favorites
        .map((s) => parseInt(s, 10))
        .filter((n) => !isNaN(n));

      if (favIds.length === 0) {
        return res.json({ favorites: [] });
      }

      // Charger les User dont l’ID est dans favIds
      appDataSource
        .getRepository(User)
        .findByIds(favIds)
        .then((favorites) => {
          res.json({ favorites });
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération des favoris' });
    });
});

// POST /favorites/:favoriteUserId
// Ajoute l’utilisateur favoriteUserId aux favoris
router.post('/:favoriteUserId', function (req, res) {
  const favoriteUserId = parseInt(req.params.favoriteUserId, 10);
  if (Number.isNaN(favoriteUserId)) {
    return res.status(400).json({ message: 'ID invalide' });
  }

  const currentUser = req.user;
  const userRepo = appDataSource.getRepository(User);

  userRepo
    .findOne({ where: { id: currentUser.id } })
    .then((me) => {
      if (!me) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      if (favoriteUserId === me.id) {
        return res.status(400).json({ message: 'Impossible de se mettre soi-même en favori' });
      }

      // Vérifier que l’utilisateur cible existe
      userRepo
        .findOne({ where: { id: favoriteUserId } })
        .then((cible) => {
          if (!cible) {
            return res.status(404).json({ message: 'Utilisateur cible introuvable' });
          }

          // Récupérer la liste actuelle de favorites (string[])
          const favIds = me.favorites
            .map((s) => parseInt(s, 10))
            .filter((n) => !isNaN(n));

          if (!favIds.includes(favoriteUserId)) {
            favIds.push(favoriteUserId);
            me.favorites = favIds.map((n) => String(n));

            userRepo
              .save(me)
              .then((saved) => {
                res.status(201).json({
                  message: 'Ajouté aux favoris',
                  favorites: saved.favorites,
                });
              })
              .catch((err) => {
                console.error(err);
                res.status(500).json({ message: 'Erreur lors de l’enregistrement des favoris' });
              });
          } else {
            res.status(400).json({ message: 'Utilisateur déjà en favoris' });
          }
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: 'Erreur serveur lors de la vérification de l’utilisateur cible' });
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération de l’utilisateur' });
    });
});

// DELETE /favorites/:favoriteUserId
// Supprime l’utilisateur favoriteUserId des favoris
router.delete('/:favoriteUserId', function (req, res) {
  const favoriteUserId = parseInt(req.params.favoriteUserId, 10);
  if (Number.isNaN(favoriteUserId)) {
    return res.status(400).json({ message: 'ID invalide' });
  }

  const currentUser = req.user;
  const userRepo = appDataSource.getRepository(User);

  userRepo
    .findOne({ where: { id: currentUser.id } })
    .then((me) => {
      if (!me) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Reconstruire le tableau en filtrant l’ID à supprimer
      const favIds = me.favorites
        .map((s) => parseInt(s, 10))
        .filter((n) => !isNaN(n) && n !== favoriteUserId);

      me.favorites = favIds.map((n) => String(n));

      userRepo
        .save(me)
        .then(() => {
          res.json({ message: 'Favori supprimé', favorites: me.favorites });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: 'Erreur lors de la mise à jour des favoris' });
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération de l’utilisateur' });
    });
});

export default router;
