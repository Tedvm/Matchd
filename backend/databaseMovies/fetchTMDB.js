import axios from 'axios';

export async function fetchAllPopularMovies() {
    const allMovies = [];
    try{
    for (let i = 1; i < 51; i++) {
  let str = i.toString();
  const options = {
  method: 'GET',
  url: 'https://api.themoviedb.org/3/movie/popular',
  params: {language: 'en-US', page: str},
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo'
  }
};
    const response = await axios.request(options);
    allMovies.push(...response.data.results);
}
    return allMovies.map((movie) => ({
        id: movie.id,
        title: movie.title,
        original_language: movie.original_language,
        overview: movie.overview,
        release_date: movie.release_date,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        userData: null,
      }));
}

    catch (err) {
    console.error('❌ Erreur lors de la récupération complète :', err.message);

    return [];
    }
}
