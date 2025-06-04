import sequelize from '../databaseMovies/index.js';
import Movie from '../databaseMovies/Movie.js';
import { fetchAllPopularMovies } from '../databaseMovies/fetchTMDB.js';

async function saveMovies() {
  try {
    await sequelize.sync({ force: true }); // supprime et recrée les tables
    const movies = await fetchAllPopularMovies();

    await Movie.bulkCreate(movies);
    console.log(`${movies.length} films sauvegardés dans la base de données.`);
  } catch (err) {
    console.error('Erreur de sauvegarde :', err.message);
  } finally {
    await sequelize.close();
  }
}

saveMovies();
