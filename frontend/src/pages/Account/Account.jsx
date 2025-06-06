// frontend/src/pages/Account/Account.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Account.css';

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
 * Récupère les détails (id, title, poster_path) de chaque film TMDb
 * dont l’ID est dans le tableau `ids`. Puis appelle setFavMovies(results).
 * Utilise un Bearer Token (TMDB V4) dans l’en-tête Authorization.
 */
async function fetchFavoriteMovies(ids, setFavMovies) {

  try {
    const promises = ids.map((movieId) =>
      axios
        .get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          params: { language: 'fr-FR' },
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
              'Content-Type': 'application/json;charset=utf-8',
          },
        })
        .then((res) => ({
          id: res.data.id,
          title: res.data.title,
          poster_path: res.data.poster_path,
        }))
    );

    const results = await Promise.all(promises);
    setFavMovies(results);
  } catch (err) {
    console.error('Erreur chargement des films favoris :', err);
  }
}

export default function Account() {
  const [user, setUser] = useState(null);
  const [favMovies, setFavMovies] = useState([]); // contiendra [{ id, title, poster_path }, …]
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);

        const favIds = Array.isArray(parsed.favorites) ? parsed.favorites : [];
        if (favIds.length > 0) {
          fetchFavoriteMovies(favIds, setFavMovies);
        }
      } catch {
        localStorage.removeItem('user');
        navigate('/users');
      }
    } else {
      navigate('/users');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/users');
  };

  if (!user) return null;

  return (
    <div className="account-container">
      <h2>Bonjour {user.email || 'Utilisateur'}</h2>

      <div className="account-section">
        <h3>Mes Favoris</h3>
        {favMovies.length === 0 ? (
          <p>Aucun favori pour l’instant.</p>
        ) : (
          <ul className="favorites-list">
            {favMovies.map((movie) => (
              <li key={movie.id} className="favorite-item">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
                    alt={movie.title}
                    className="favorite-poster"
                  />
                ) : (
                  <div className="favorite-no-poster">Pas d’image</div>
                )}
                <span className="favorite-title">{movie.title}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={handleLogout} className="logout-button">
        Se déconnecter
      </button>
    </div>
  );
}
