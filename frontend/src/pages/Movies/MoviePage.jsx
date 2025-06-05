import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MoviePage.css';

function MoviePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        Sorti en {movie.release_date?.slice(0, 4)} • Note :{' '}
        {movie.vote_average?.toFixed(1)} ⭐
        <br />
        Genres : {movie.genres?.map((genre) => genre.name).join(', ')}
      </p>
      <p className="movie-synopsis">{movie.overview}</p>
    </div>
  );
}

export default MoviePage;
