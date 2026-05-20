import { useState, useEffect } from 'react';
import './index.css';

const API_URL = 'http://localhost:8000/api';

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

function App() {
  const [trending, setTrending] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/trending`);
      const data = await response.json();
      if (response.ok) {
        setTrending(data.trending || []);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load trending movies.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setSelectedMovie(null);
    setRecommendations(null);

    try {
      const response = await fetch(`${API_URL}/recommend?movie_name=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (response.ok) {
        setSelectedMovie(data.target_movie);
        setRecommendations(data.recommendations);
      } else {
        setError(data.detail || 'Movie not found.');
      }
    } catch (err) {
      setError('Failed to fetch recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setRecommendations(null);
    setSelectedMovie(null);
    setError(null);
  };

  return (
    <>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      
      <div className="container">
        <header className="header">
          <div>
            <h1>CineMatch AI</h1>
            <p className="subtitle">Discover your next favorite movie with intelligent AI recommendations.</p>
          </div>
          <form className="search-form" onSubmit={handleSearch}>
            <SearchIcon />
            <input
              type="text"
              className="search-input"
              placeholder="Search for a movie (e.g., Inception, Interstellar)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">Recommend</button>
          </form>
        </header>

        {loading && (
          <div className="loader-container">
            <div className="spinner"></div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {!loading && selectedMovie && recommendations && (
          <div>
            <button className="back-btn" onClick={clearSearch}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Trending
            </button>
            
            <div className="detail-view">
              <div className="detail-hero">
                <img 
                  src={selectedMovie.poster_path || 'https://via.placeholder.com/300x450?text=No+Poster'} 
                  alt={selectedMovie.title} 
                  className="detail-poster"
                />
                <div className="detail-content">
                  <h2 className="detail-title">{selectedMovie.title}</h2>
                  <div className="rating" style={{marginBottom: '1.5rem'}}>
                    <StarIcon /> {selectedMovie.vote_average?.toFixed(1)} / 10
                  </div>
                  <p className="detail-overview">{selectedMovie.overview}</p>
                  <div className="detail-genres">
                    {selectedMovie.genres && selectedMovie.genres.map((g, i) => (
                      <span key={i} className="genre-tag">{g.name}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <h3 className="section-title">Similar Movies You Might Like</h3>
            <div className="movie-grid">
              {recommendations.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}

        {!loading && !selectedMovie && trending.length > 0 && (
          <div>
            <h3 className="section-title">Trending Now</h3>
            <div className="movie-grid">
              {trending.map(movie => (
                <MovieCard key={movie.id} movie={movie} onClick={() => {
                  setSearchQuery(movie.title);
                  handleSearch({preventDefault: () => {}});
                }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function MovieCard({ movie, onClick }) {
  return (
    <div className="movie-card" onClick={onClick}>
      <div className="poster-wrapper">
        <img 
          src={movie.poster_path || 'https://via.placeholder.com/300x450?text=No+Poster'} 
          alt={movie.title} 
          className="poster-img"
          loading="lazy"
        />
      </div>
      <div className="movie-info">
        <h4 className="movie-title">{movie.title}</h4>
        <div className="movie-meta">
          <span className="rating">
            <StarIcon /> {movie.vote_average?.toFixed(1)}
          </span>
        </div>
        <div className="genres">
          {movie.genres && movie.genres.slice(0, 2).map((g, i) => (
            <span key={i} className="genre-tag">{g.name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
