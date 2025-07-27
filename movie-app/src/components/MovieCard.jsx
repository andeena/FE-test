import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FavoritesContext } from '../context/FavoritesContext';

const MovieCard = ({ movie }) => {
  const { toggleFavorite, isFavorited } = useContext(FavoritesContext);
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

    const handleFavoriteClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(movie);
    };
  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <button
        className={`favorite-btn ${isFavorited(movie.id) ? 'active' : ''}`}
        onClick={handleFavoriteClick}
      >
        ❤️
      </button>

      <img src={posterUrl} alt={`${movie.title} poster`} />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <span>⭐ {movie.vote_average.toFixed(1)}</span>
      </div>
    </Link>
  );
};

export default MovieCard;