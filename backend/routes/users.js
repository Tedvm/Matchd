import express from 'express';
import { appDataSource } from '../datasource.js';
import User from '../entities/user.js';

const router = express.Router();

router.get('/', function (req, res) {
  appDataSource
    .getRepository(User)
    .find({})
    .then(function (users) {
      res.json({ users: users });
    });
});

router.post('/new', function (req, res) {
  const userRepository = appDataSource.getRepository(User);
  const newUser = userRepository.create({
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
    favorites: req.body.favorites || [],
    vus: req.body.vus || [],
  });

  userRepository
    .save(newUser)
    .then(function (savedUser) {
      res.status(201).json({
        message: 'User successfully created',
        id: savedUser.id,
      });
    })
    .catch(function (error) {
      console.error(error);
      if (error.code === '23505') {
        res.status(400).json({
          message: `User with email "${newUser.email}" already exists`,
        });
      } else {
        res.status(500).json({ message: 'Error while creating the user' });
      }
    });
});

router.patch('/:userId/favorites', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const newFavorites = Array.isArray(req.body.favorites) ? req.body.favorites : [];

  try {
    const userRepository = appDataSource.getRepository(User);

    // On récupère d'abord l'utilisateur pour vérifier qu'il existe
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // On remplace le champ favorites en base par newFavorites
    user.favorites = newFavorites;
    const savedUser = await userRepository.save(user);

    // On renvoie l'utilisateur mis à jour (ou uniquement le champ favorites)
    return res.json({ 
      id: savedUser.id,
      email: savedUser.email,
      firstname: savedUser.firstname,
      lastname: savedUser.lastname,
      favorites: savedUser.favorites
    });
  } catch (error) {
    console.error('Erreur update favorites:', error);
    return res.status(500).json({ message: 'Impossible de mettre à jour les favoris' });
  }
});

router.delete('/:userId', function (req, res) {
  appDataSource
    .getRepository(User)
    .delete({ id: req.params.userId })
    .then(function () {
      res.status(204).json({ message: 'User successfully deleted' });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while deleting the user' });
    });
});

export default router;
