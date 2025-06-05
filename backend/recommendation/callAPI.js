import fetch from 'node-fetch';

async function getSimilarMovies(id, topN = 10) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/similar_movies?id=${id}&top_n=${topN}`
    );
    const data = await response.json();

    if (response.ok) {
      console.log('Films similaires :', data.results);

      return data.results;
    } else {
      console.error('Erreur serveur :', data.error);

      return [];
    }
  } catch (err) {
    console.error('Erreur réseau :', err);

    return [];
  }
}

getSimilarMovies(11, 5);
