import './Home.css';
// eslint-disable-next-line import/order
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearch } from '../../context/SearchContext';

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

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { query } = useSearch();

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>films populaires</h1>
      </header>
      {loading && <p>Chargement...</p>}
      {error && <p>{error}</p>}
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <p>{movie.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const IntroVideo = ({ onVideoEnd }) => {
  return (
    <div
      className="video-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        backgroundColor: 'black',
      }}
    >
      <video
        src="/intro.mp4"
        autoPlay
        muted
        onEnded={onVideoEnd}
        className="fullscreen-video"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
  );
};

const HomeWithIntro = () => {
  const [introSeen, setIntroSeen] = useState(() => {
    return sessionStorage.getItem(VIDEO_SEEN_KEY) === 'true';
  });

  const handleVideoEnd = () => {
    sessionStorage.setItem(VIDEO_SEEN_KEY, 'true');
    setIntroSeen(true);
  };

  return introSeen ? <Home /> : <IntroVideo onVideoEnd={handleVideoEnd} />;
};

export default HomeWithIntro;
