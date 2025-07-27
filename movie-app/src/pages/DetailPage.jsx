import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const DetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const movieDetailUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`;
        const creditsUrl = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=en-US`;
        const videosUrl = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`;

        const responses = await Promise.all([
          fetch(movieDetailUrl),
          fetch(creditsUrl),
          fetch(videosUrl),
        ]);

        for (const response of responses) {
          if (!response.ok) {
            throw new Error('Failed to fetch data. Please try again.');
          }
        }

        const [movieData, creditsData, videosData] = await Promise.all(
          responses.map((res) => res.json())
        );

        setMovie(movieData);
        setCast(creditsData.cast);

        const officialTrailer = videosData.results.find(
          (video) => video.site === 'YouTube' && video.type === 'Trailer'
        );
        setTrailer(officialTrailer);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  if (isLoading) return <p className="status-message">Loading details...</p>;
  if (error) return <p className="status-message error">{error}</p>;
  if (!movie) return null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <>
      {showTrailer && trailer && (
        <div className="trailer-modal" onClick={() => setShowTrailer(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowTrailer(false)}>
              &times;
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <div className="container">
        <Link to="/" className="back-link">&larr; Back to Search</Link>
        <div className="movie-detail-layout">
          <img src={posterUrl} alt={`${movie.title} poster`} className="detail-poster" />
          <div className="detail-info">
            <h1>{movie.title} ({new Date(movie.release_date).getFullYear()})</h1>
            <p className="tagline"><em>{movie.tagline}</em></p>
            <div className="detail-meta">
              <span>⭐ {movie.vote_average.toFixed(1)}/10</span>
              <span> | </span>
              <span>{movie.runtime} min</span>
              <span> | </span>
              <span>{movie.genres.map(g => g.name).join(', ')}</span>
            </div>
            
            {trailer && (
              <button className="trailer-btn" onClick={() => setShowTrailer(true)}>
                🎬 Watch Trailer
              </button>
            )}

            <h2>Overview</h2>
            <p>{movie.overview}</p>
          </div>
        </div>

        {cast.length > 0 && (
          <div className="cast-section">
            <h2>Main Cast</h2>
            <div className="cast-grid">
              {cast.slice(0, 10).map((member) => (
                <div key={member.cast_id} className="cast-member">
                  <img
                    src={
                      member.profile_path
                        ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                        : 'https://via.placeholder.com/185x278?text=No+Image'
                    }
                    alt={member.name}
                  />
                  <strong>{member.name}</strong>
                  <span>{member.character}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DetailPage;