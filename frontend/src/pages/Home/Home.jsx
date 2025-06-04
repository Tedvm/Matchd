import logo from './logo.svg';
import './Home.css';
// eslint-disable-next-line import/order
import React, { useEffect, useState } from 'react';
import axios from 'axios';
const VIDEO_SEEN_KEY = 'introVideoSeen';

function Movie({ film }) {
  const posterUrl = film.poster_path
    ? `https://image.tmdb.org/t/p/w300${film.poster_path}`
    : null;

  const year = film.release_date
    ? new Date(film.release_date).getFullYear()
    : 'Année inconnue';

  const note = film.vote_average ? `– ${film.vote_average.toFixed(1)} ⭐` : '';

  return (
    <div className="movie-card">
      {posterUrl ? (
        <div className="movie-poster-container">
          <img src={posterUrl} alt={film.title} className="movie-poster" />
        </div>
      ) : (
        <div className="movie-poster-container">
          <div
            className="movie-poster"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#ccc',
            }}
          >
            Pas d’image
          </div>
        </div>
      )}

      <h4
        style={{
          fontSize: '1.2rem',
          margin: '0.5rem 0 0.2rem 0',
          textAlign: 'center',
        }}
      >
        {film.title}
      </h4>

      <p
        style={{
          fontSize: '0.8rem',
          color: '#ccc',
          margin: 0,
          textAlign: 'center',
        }}
      >
        {year} {note}
      </p>
    </div>
  );
}

function useFetchMovies(query) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      const baseUrl = query.trim()
        ? 'https://api.themoviedb.org/3/search/movie'
        : 'https://api.themoviedb.org/3/movie/popular';

      const params = { language: 'fr-FR' };
      if (query.trim()) {
        params.query = query;
      }

      try {
        const response = await axios.get(baseUrl, {
          params,
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
            'Content-Type': 'application/json;charset=utf-8',
          },
        });

        const results = response.data.results.slice(0, 10);
        setMovies(results);
      } catch (err) {
        setError('Erreur lors du chargement des films');
        console.error(err);
      }

      setLoading(false);
    };

    fetchMovies();
  }, [query]);

  return { movies, loading, error };
}

function Home() {
  const [movieName, setMovieName] = useState('');
  const { movies, loading, error } = useFetchMovies(movieName);
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem(VIDEO_SEEN_KEY);
    if (!alreadySeen) {
      setShowVideo(true);
    } else {
      setVideoEnded(true);
    }
  }, []);

  const handleVideoEnd = () => {
    sessionStorage.setItem(VIDEO_SEEN_KEY, 'true');
    setShowVideo(false);
    setVideoEnded(true);
  };

  return (
    <>
      {showVideo && (
        <video
          src="/intro.mp4"
          autoPlay
          muted
          onEnded={handleVideoEnd}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            zIndex: 1000,
          }}
        />
      )}

      {videoEnded && (
        <div className="App">
          <header className="App-header">
            <h1>Accueil</h1>
            <input
              type="text"
              className="search-bar"
              placeholder="Rechercher un film"
              value={movieName}
              onChange={(e) => setMovieName(e.target.value)}
            />

            {loading && <p>Chargement...</p>}
            {error && <p>{error}</p>}

            <h4>
              {movieName.trim() === ''
                ? '10 films les plus populaires :'
                : 'Résultats :'}
            </h4>

            <div className="movies-grid">
              {movies.length > 0
                ? movies.map((film) => <Movie key={film.id} film={film} />)
                : !loading && <p>Aucun film trouvé</p>}
            </div>
          </header>
        </div>
      )}
    </>
  );
}

export default Home;
