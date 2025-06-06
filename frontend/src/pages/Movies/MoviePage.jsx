// frontend/src/pages/MoviePage/MoviePage.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MoviePage.css';

// On lit la variable d’environnement (doit être défini après redémarrage Vite)
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function getUserFavorites() {
  try {
    const stored = localStorage.getItem('user');
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed.favorites) ? parsed.favorites : [];
  } catch {
    return [];
  }
}

function addUserFavorite(movieId) {
  try {
    const stored = localStorage.getItem('user');
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    const favs = Array.isArray(parsed.favorites) ? [...parsed.favorites] : [];
    if (!favs.map(String).includes(String(movieId))) {
      favs.push(String(movieId));
      const updatedUser = { ...parsed, favorites: favs };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    return favs;
  } catch {
    return [];
  }
}

function MoviePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    // Afficher la clé dans la console pour debug
    console.log('⇒ TMDB_API_KEY =', TMDB_API_KEY);

    const fetchMovie = async () => {
      if (!TMDB_API_KEY) {
        console.error('VITE_TMDB_API_KEY est manquante ou invalide.');
        setError('Clé TMDB manquante');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}`,
          {
            params: {
              language: 'fr-FR',
              api_key: TMDB_API_KEY,
            },
          }
        );
        setMovie(response.data);
      } catch (err) {
        console.error(err);
        setError('Film introuvable ou clé TMDB invalide');
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  useEffect(() => {
    const favIds = getUserFavorites();
    if (favIds.map(String).includes(String(id))) {
      setIsFavorited(true);
    }
  }, [id]);

  const handleAddFavorite = () => {
    const favs = addUserFavorite(id);
    if (favs.map(String).includes(String(id))) {
      setIsFavorited(true);
      alert('Film ajouté aux favoris !');
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="movie-page">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="movie-poster"
      />
      <h1 className="movie-title">{movie.title}</h1>
      <p className="movie-details">
        Sorti en {movie.release_date?.slice(0, 4)} • Note :{' '}
        {movie.vote_average?.toFixed(1)} ⭐
        <br />
        Genres : {movie.genres?.map((genre) => genre.name).join(', ')}
      </p>
      <p className="movie-synopsis">{movie.overview}</p>

      <button
        className={`favorite-button ${isFavorited ? 'favorited' : ''}`}
        onClick={handleAddFavorite}
        disabled={isFavorited}
      >
        {isFavorited ? '✓ Favori' : 'Ajouter aux favoris'}
      </button>
    </div>
  );
}

export default MoviePage;
