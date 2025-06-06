import React, { useEffect, useState } from 'react';
import TinderCard from 'react-tinder-card';
import axios from 'axios';
import './SwipePage.css';

const USER_ID = 1; // à adapter dynamiquement plus tard si besoin

const SwipePage = () => {
  const [films, setFilms] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Charger les films recommandés depuis ton backend local
  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const res = await axios.get('/backend/recommendantion/callAPI', {
          params: { userId: USER_ID },
        });
        console.log('Films reçus :', res.data); // ← ICI
        setFilms(res.data);
      } catch (err) {
        console.error('Erreur chargement recommandations', err);
      }
    };

    fetchFilms();
  }, []);

  // Enregistrer le like/dislike
  const sendChoice = async (choice) => {
    const film = films[currentIndex];
    if (!film) {
      return;
    }

    try {
      await axios.post('/api/user-choice', {
        userId: USER_ID,
        movieId: film.id,
        choice,
      });
    } catch (err) {
      console.error(`Erreur lors du ${choice}`, err);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const film = films[currentIndex];

  return (
    <div className="swipe-page">
      {film ? (
        <>
          <TinderCard key={film.id} preventSwipe={['up', 'down']}>
            <div className="film-card">
              <img
                src={film.poster_url} // ✅ Utilise l'URL locale ou complète
                alt={film.title}
              />
              <h2>{film.title}</h2>
              <p>{film.overview}</p>
            </div>
          </TinderCard>
          <div className="button-container">
            <button
              className="dislike-btn"
              onClick={() => sendChoice('dislike')}
            >
              ❌
            </button>
            <button className="like-btn" onClick={() => sendChoice('like')}>
              ❤️
            </button>
          </div>
        </>
      ) : (
        <p className="end-text">Plus de films à afficher 😢</p>
      )}
    </div>
  );
};

export default SwipePage;
