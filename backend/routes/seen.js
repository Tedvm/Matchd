// backend/routes/vus.js
import express from 'express';
import { appDataSource } from '../datasource.js';
import User from '../entities/user.js';

const router = express.Router();

// GET /vus
// Renvoie la liste des “vus” (avec leur note) de l’utilisateur connecté
router.get('/', function (req, res) {
  const currentUser = req.user;
  appDataSource
    .getRepository(User)
    .findOne({ where: { id: currentUser.id } })
    .then((me) => {
      if (!me) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      // me.vus est un simple-json stockant des objets { id: number, note: number }
      const vusArray = Array.isArray(me.vus) ? me.vus : [];
      const vusIds = vusArray.map((x) => x.id).filter((n) => !isNaN(n));

      if (vusIds.length === 0) {
        return res.json({ vus: [] });
      }

      // Charger les User dont l’ID est dans vusIds
      appDataSource
        .getRepository(User)
        .findByIds(vusIds)
        .then((usersVus) => {
          // Construire un tableau [{ user: <User>, note: <number> }, …]
          const resultat = usersVus.map((u) => {
            const obj = vusArray.find((x) => x.id === u.id);
            return { user: u, note: obj.note };
          });
          res.json({ vus: resultat });
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération des vus' });
    });
});

// POST /vus/:vuUserId
// Ajoute ou met à jour l’utilisateur vuUserId avec la note donnée dans le corps { note: <number> }
router.post('/:vuUserId', function (req, res) {
  const vuUserId = parseInt(req.params.vuUserId, 10);
  const note = parseFloat(req.body.note);

  if (Number.isNaN(vuUserId) || Number.isNaN(note) || note < 0 || note > 5) {
    return res.status(400).json({ message: 'Paramètres invalides' });
  }

  const currentUser = req.user;
  const userRepo = appDataSource.getRepository(User);

  userRepo
    .findOne({ where: { id: currentUser.id } })
    .then((me) => {
      if (!me) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      if (vuUserId === me.id) {
        return res.status(400).json({ message: 'Impossible de se noter soi-même' });
      }

      // Vérifier que l’utilisateur cible existe
      userRepo
        .findOne({ where: { id: vuUserId } })
        .then((cible) => {
          if (!cible) {
            return res.status(404).json({ message: 'Utilisateur cible introuvable' });
          }

          // Récupérer le tableau actuel
          let vusArray = Array.isArray(me.vus) ? me.vus : [];
          const indexExistant = vusArray.findIndex((x) => x.id === vuUserId);

          if (indexExistant >= 0) {
            // Mettre à jour la note si déjà présent
            vusArray[indexExistant].note = note;
          } else {
            // Sinon ajouter un nouvel objet { id, note }
            vusArray.push({ id: vuUserId, note });
          }

          me.vus = vusArray;
          userRepo
            .save(me)
            .then((saved) => {
              res.status(201).json({
                message: 'Utilisateur ajouté/mis à jour dans vus',
                vus: saved.vus,
              });
            })
            .catch((err) => {
              console.error(err);
              res.status(500).json({ message: 'Erreur lors de l’enregistrement des vus' });
            });
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

// DELETE /vus/:vuUserId
// Supprime l’entrée { id: vuUserId, note } de la liste vus
router.delete('/:vuUserId', function (req, res) {
  const vuUserId = parseInt(req.params.vuUserId, 10);
  if (Number.isNaN(vuUserId)) {
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

      // Filtrer pour supprimer l’entrée correspondante
      let vusArray = Array.isArray(me.vus) ? me.vus : [];
      vusArray = vusArray.filter((x) => x.id !== vuUserId);

      me.vus = vusArray;
      userRepo
        .save(me)
        .then(() => {
          res.json({ message: 'Utilisateur retiré de vus', vus: me.vus });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: 'Erreur lors de la mise à jour des vus' });
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération de l’utilisateur' });
    });
});

export default router;
