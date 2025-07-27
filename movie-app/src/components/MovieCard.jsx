import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <img src={posterUrl} alt={`${movie.title} poster`} />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <span>⭐ {movie.vote_average.toFixed(1)}</span>
      </div>
    </Link>
  );
};

export default MovieCard;