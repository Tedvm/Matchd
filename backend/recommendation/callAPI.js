import fetch from 'node-fetch';

export async function getSimilarMovies(id, topN = 10) {
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

export async function getGroupSimilarMovies(movieIds, topN = 10) {
  try {
    const params = new URLSearchParams();
    movieIds.forEach((id) => params.append('movie_ids', id));
    params.append('top_n', topN);

    const response = await fetch(
      `http://127.0.0.1:8000/group_recommendations?${params.toString()}`
    );
    const data = await response.json();

    if (response.ok) {
      console.log('Films similaires pour le groupe :', data.results);

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
