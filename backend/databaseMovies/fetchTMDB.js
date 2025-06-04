import axios from 'axios';

const API_TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    accept: 'application/json',
    Authorization: API_TOKEN,
  },
});

export async function fetchAllPopularMovies() {
  let totalPages = 1;
  const allMovies = [];

  try {
    // 1. Récupère la première page
    const firstResponse = await api.get('/movie/popular', {
      params: { language: 'en-US', page: 1 },
    });

    // ⚠️ Correction : ajout d'une virgule oubliée + userData
    const firstPageMovies = firstResponse.data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      original_language: movie.original_language,
      overview: movie.overview,
      release_date: movie.release_date,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      userData: null, //ajout du champ userData pour qu'on stocke nos données
    }));

    allMovies.push(...firstPageMovies);

    // 2. Récupère le total de pages
    totalPages = firstResponse.data.total_pages;

    // 3. Boucle sur les pages suivantes
    for (let page = 2; page <= totalPages; page++) {
      const response = await api.get('/movie/popular', {
        params: { language: 'en-US', page },
      });

      const pageMovies = response.data.results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        original_language: movie.original_language,
        overview: movie.overview,
        release_date: movie.release_date,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        userData: null,
      }));

      allMovies.push(...pageMovies);
    }

    return allMovies;
  } catch (err) {
    console.error('❌ Erreur lors de la récupération complète :', err.message);

    return [];
  }
}
