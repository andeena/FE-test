import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FavoritesContext } from '../context/FavoritesContext';
import MovieCard from '../components/MovieCard';

const FavoritesPage = () => {
  const { favorites } = useContext(FavoritesContext);

  return (
    <div className="container">
      <h1 className="page-title">My Favorite Movies</h1>
      
      {favorites.length > 0 ? (
        <div className="movie-grid">
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="status-message">
          <p>Anda belum memiliki film favorit.</p>
          <Link to="/" className="back-link" style={{ marginTop: '1rem' }}>
            Cari Film Sekarang
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;