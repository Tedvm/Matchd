// frontend/src/pages/MoviePage/MoviePage.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MoviePage.css';

/**
 * Lit le tableau “favorites” dans l’objet “user” stocké en localStorage.
 * Renvoie un tableau d’IDs (string[]).
 */
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

/**
 * Ajoute l’ID du film dans “user.favorites” en localStorage si pas déjà présent.
 * Retourne le tableau mis à jour.
 */
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
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?language=fr-FR`,
          {
            headers: {
              Authorization:
                'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
              'Content-Type': 'application/json;charset=utf-8',
            },
          }
        );
        setMovie(response.data);
      } catch (err) {
        console.error(err);
        setError('Film introuvable');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  useEffect(() => {
    // Vérifier si ce film est déjà dans “favorites” de l’utilisateur stocké
    const favIds = getUserFavorites();
    if (favIds.map(String).includes(String(id))) {
      setIsFavorited(true);
    }
  }, [id]);

  const handleAddFavorite = () => {
    const userStored = localStorage.getItem('user');
  
    if (!userStored) {
      alert("Vous n'êtes pas connecté(e) !");
      return;
    }
  
    const favs = addUserFavorite(id);
    if (favs.map(String).includes(String(id))) {
      setIsFavorited(true);
      alert('Film ajouté aux favoris !');
    }
  };

  if (loading) {
    return <p>Chargement...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="movie-page">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="movie-poster"
      />
      <h1 className="movie-title">{movie.title}</h1>
      <p className="movie-details">
        {movie.release_date?.slice(0, 4)} - {movie.vote_average?.toFixed(1)} ⭐
        <br />
        {movie.genres?.map((genre) => genre.name).join(' • ')}
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
