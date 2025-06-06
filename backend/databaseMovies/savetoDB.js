import { appDataSource } from './appDataSource.js';
import { fetchAllPopularMovies } from './fetchTMDB.js';
import Movie from './Movie.js';

async function saveMovies() {
  try {
    await appDataSource.initialize();
    const movieRepo = appDataSource.getRepository(Movie);

    const movies = await fetchAllPopularMovies();
    await movieRepo.clear();
    await movieRepo.upsert(movies, ['id']); //save qui permet de faire des modifs

    console.log(`${movies.length} films sauvegardés dans la base de données.`);
  } catch (err) {
    console.error('Erreur de sauvegarde :', err.message);
  } finally {
    await appDataSource.destroy();
  }
}

saveMovies();
