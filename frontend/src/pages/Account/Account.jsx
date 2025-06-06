// frontend/src/pages/Account/Account.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Account.css';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function Account() {
  const [user, setUser] = useState(null);
  const [favMovies, setFavMovies] = useState([]); // détails des films favoris
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);

        // Si des favoris existent, on les charge depuis TMDB
        const favIds = Array.isArray(parsed.favorites) ? parsed.favorites : [];
        if (favIds.length > 0) {
          fetchFavoriteMovies(favIds);
        }
      } catch {
        localStorage.removeItem('user');
        navigate('/users');
      }
    } else {
      navigate('/users');
    }
  }, [navigate]);

  const fetchFavoriteMovies = async (ids) => {
    try {
      const promises = ids.map((id) =>
        axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
          params: {
            language: 'fr-FR',
            api_key: TMDB_API_KEY,
          },
        }).then((res) => ({
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
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/users');
  };

  if (!user) return null;

  return (
    <div className="account-container">
      <h2>Bonjour {user.email || user.name || 'Utilisateur'}</h2>

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
