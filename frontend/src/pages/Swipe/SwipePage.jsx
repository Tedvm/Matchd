import React, { useEffect, useState } from 'react';
import TinderCard from 'react-tinder-card';
import axios from 'axios';
import './SwipePage.css';

const SwipePage = () => {
  const [films, setFilms] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const res = await axios.get('/api/movies/recommend');
        setFilms(res.data); // data = liste des films recommandés depuis DB
      } catch (err) {
        console.error('Erreur chargement recommandations', err);
      }
    };

    fetchFilms();
  }, []);

  const handleSwipe = async (direction) => {
    const film = films[currentIndex];
    if (!film) {
      return;
    }

    try {
      if (direction === 'right') {
        await axios.post('/api/user/like', { filmId: film.id });
      } else if (direction === 'left') {
        await axios.post('/api/user/dislike', { filmId: film.id });
      }
    } catch (err) {
      console.error('Erreur lors du like/dislike', err);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const film = films[currentIndex];

  return (
    <div className="swipe-page">
      {film ? (
        <TinderCard
          key={film.id}
          onSwipe={handleSwipe}
          preventSwipe={['up', 'down']}
        >
          <div className="film-card">
            <img
              src={`https://image.tmdb.org/t/p/w300${film.poster_path}`}
              alt={film.title}
            />
            <h2>{film.title}</h2>
            <p>{film.overview}</p>
          </div>
        </TinderCard>
      ) : (
        <p className="end-text">Plus de films à afficher 😢</p>
      )}
    </div>
  );
};

export default SwipePage;
