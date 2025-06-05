import { appDataSource } from '../datasource.js';
import User from '../entities/user.js';
import express from 'express';

const router = express.Router();

router.post('/', async function (req, res) {
    const userRepository = appDataSource.getRepository(User);
  
    try {
      // Rechercher l'utilisateur par email
      const user = await userRepository.findOneBy({ email: req.body.email });
  
      if (!user) {
        // Si l'utilisateur n'existe pas
        return res.status(401).json({ error: 'Invalid email or password' });
      }
        
      // Vérifier si le mot de passe correspond
      if (user.password !== req.body.password) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      // Si tout est valide, retourner les informations de l'utilisateur
      res.json({
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  export default router;