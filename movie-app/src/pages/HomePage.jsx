import { useState, useEffect, useCallback } from 'react';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import SkeletonCard from '../components/SkeletonCard';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchMovies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setMovies([]);

    const url = searchTerm
      ? `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${currentPage}`
      : `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}&page=${currentPage}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Something went wrong. Please try again later.');
      }
      const data = await response.json();
      if (data.results.length === 0) {
        setMovies([]);
        setError('No movies found for your search.');
      } else {
        setMovies(data.results);
        setTotalPages(data.total_pages > 500 ? 500 : data.total_pages); // TMDB API limitation
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, currentPage]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchTerm(query.trim() === '' ? 'popular' : query);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
        />
        <button type="submit">Search</button>
      </form>

      <div className="movie-grid">
        {isLoading ? (
          Array.from({ length: 10 }).map((_, index) => <SkeletonCard key={index} />)
        ) : !error ? (
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : null}
      </div>

      {!isLoading && !error && (
        <>
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;