import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const DetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch movie details.');
        }
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (isLoading) return <p className="status-message">Loading details...</p>;
  if (error) return <p className="status-message error">{error}</p>;
  if (!movie) return null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <div className="container">
      <Link to="/" className="back-link">&larr; Back to Search</Link>
      <div className="movie-detail-layout">
        <img src={posterUrl} alt={`${movie.title} poster`} className="detail-poster" />
        <div className="detail-info">
          <h1>{movie.title} ({new Date(movie.release_date).getFullYear()})</h1>
          <p className="tagline"><em>{movie.tagline}</em></p>
          <div className="detail-meta">
            <span>🌟 {movie.vote_average.toFixed(1)}/10</span>
            <span> | </span>
            <span>{movie.runtime} min</span>
            <span> | </span>
            <span>{movie.genres.map(g => g.name).join(', ')}</span>
          </div>
          <h2>Overview</h2>
          <p>{movie.overview}</p>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;