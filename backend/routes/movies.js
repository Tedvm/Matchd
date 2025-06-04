import express from 'express';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movies.js';
const app = express();
const router = express.Router();

router.get('/', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .find({})
    .then(function (movies) {
      res.json({ movies: movies });
    });
});

router.post('/new', function (req, res) {
  const movieRepository = appDataSource.getRepository(Movie);
  const newMovie = movieRepository.create({
    title: req.body.title,
    releasedate: req.body.releasedate,
  });

  movieRepository
    .save(newMovie)
    .then(function (savedMovie) {
      res.status(201).json({
        message: 'Movie successfully posted',
        id: savedMovie.id,
      });
    })
    .catch(function (error) {
      console.error(error);
      if (error.code === '23505') {
        res.status(400).json({
          message: `Movie with title "${newMovie.title}" already exists`,
        });
      } else {
        res.status(500).json({ message: 'Error while posting the movie' });
      }
    });
});

// Route pour récupérer un film par son ID
app.get('/movies/:id', (req, res) => {
  const movieId = parseInt(req.params.id, 10);
  const movie = Movie.find((m) => m.id === movieId);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(404).json({ error: 'Film non trouvé' });
  }
});

app.listen(3000, () => {
  console.log(`Serveur en écoute sur http://localhost:3000`);
});

router.delete('/:movieId', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .delete({ id: req.params.movieId })
    .then(function () {
      res.status(200).json({ message: 'User successfully deleted' });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while deleting the user' });
      res
        .status(404)
        .json({ message: 'Error : the movie does not exist in database' });
    });
});

export default router;
