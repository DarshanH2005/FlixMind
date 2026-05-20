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

const HeartIcon = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' or 'watchlist'
  const [trending, setTrending] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreMovies, setGenreMovies] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('flixmind_watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrending();
    fetchGenres();
  }, []);

  useEffect(() => {
    localStorage.setItem('flixmind_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

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

  const fetchGenres = async () => {
    try {
      const response = await fetch(`${API_URL}/genres`);
      const data = await response.json();
      if (response.ok) {
        setGenres(data.genres || []);
      }
    } catch (err) {
      console.error('Failed to load genres:', err);
    }
  };

  const fetchMoviesByGenre = async (genreName) => {
    setLoading(true);
    setError(null);
    setSelectedGenre(genreName);
    setRecommendations(null);
    setSelectedMovie(null);
    
    try {
      const response = await fetch(`${API_URL}/movies?genre=${encodeURIComponent(genreName)}`);
      const data = await response.json();
      if (response.ok) {
        setGenreMovies(data.movies || []);
      } else {
        setError('Failed to fetch movies for this genre.');
      }
    } catch (err) {
      setError('Failed to fetch movies.');
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
    setSelectedGenre(null);

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

  const selectMovieDirectly = async (movieTitle) => {
    setSearchQuery(movieTitle);
    setLoading(true);
    setError(null);
    setSelectedMovie(null);
    setRecommendations(null);
    setSelectedGenre(null);

    try {
      const response = await fetch(`${API_URL}/recommend?movie_name=${encodeURIComponent(movieTitle)}`);
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
    setSelectedGenre(null);
  };

  const toggleWatchlist = (movie) => {
    const isAdded = watchlist.some(m => m.id === movie.id);
    if (isAdded) {
      setWatchlist(watchlist.filter(m => m.id !== movie.id));
    } else {
      setWatchlist([...watchlist, movie]);
    }
  };

  const isWatchlisted = (movieId) => {
    return watchlist.some(m => m.id === movieId);
  };

  // The first trending movie acts as our "Featured Movie" hero banner
  const featuredMovie = trending.length > 0 ? trending[0] : null;

  return (
    <>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      
      <div className="container">
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="nav-brand" onClick={() => { setActiveTab('home'); clearSearch(); }}>
            🎬 FlixMind
          </div>
          <ul className="nav-links">
            <li 
              className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => { setActiveTab('home'); clearSearch(); }}
            >
              Home
            </li>
            <li 
              className={`nav-link ${activeTab === 'watchlist' ? 'active' : ''}`}
              onClick={() => { setActiveTab('watchlist'); clearSearch(); }}
            >
              Watchlist ({watchlist.length})
            </li>
          </ul>
        </nav>

        {activeTab === 'home' && (
          <>
            {/* Search Header */}
            {!selectedMovie && !selectedGenre && (
              <header className="home-header">
                <div>
                  <h1>FlixMind AI</h1>
                  <p className="subtitle" style={{marginTop: '0.5rem'}}>Discover your next favorite movie with intelligent AI recommendations.</p>
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
            )}

            {/* Featured Hero Banner (Only shown on fresh homepage mount) */}
            {!loading && !selectedMovie && !selectedGenre && featuredMovie && (
              <div 
                className="hero-banner" 
                style={{ backgroundImage: `linear-gradient(to right, rgba(3,3,3,0.95), rgba(3,3,3,0.3)), url(${featuredMovie.poster_path})` }}
              >
                <div className="hero-overlay">
                  <div className="hero-content">
                    <span className="hero-badge">Featured Showcase</span>
                    <h2 className="hero-title">{featuredMovie.title}</h2>
                    <div className="hero-meta">
                      <span className="rating"><StarIcon /> {featuredMovie.vote_average?.toFixed(1)}</span>
                      <span style={{color: 'var(--text-muted)'}}>Trending Pick</span>
                    </div>
                    <p className="hero-plot">{featuredMovie.overview}</p>
                    <button 
                      className="hero-btn" 
                      onClick={() => selectMovieDirectly(featuredMovie.title)}
                    >
                      🔮 Get Similar Recommendations
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Horizontal Genre Selector Bar */}
            {!selectedMovie && genres.length > 0 && (
              <div className="genre-scroll-wrapper">
                <div className="genre-scroll">
                  <button 
                    className={`genre-pill ${selectedGenre === null ? 'active' : ''}`}
                    onClick={() => { setSelectedGenre(null); setGenreMovies([]); }}
                  >
                    Trending
                  </button>
                  {genres.map((g, idx) => (
                    <button 
                      key={idx}
                      className={`genre-pill ${selectedGenre === g ? 'active' : ''}`}
                      onClick={() => fetchMoviesByGenre(g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {loading && (
          <div className="loader-container">
            <div className="spinner"></div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {/* 1. Detail view with Similar Movie Recommendations */}
        {!loading && selectedMovie && recommendations && (
          <div>
            <button className="back-btn" onClick={clearSearch}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Browse
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
                  <div className="detail-actions">
                    <button 
                      className={`watchlist-btn ${isWatchlisted(selectedMovie.id) ? 'added' : ''}`}
                      onClick={() => toggleWatchlist(selectedMovie)}
                    >
                      <HeartIcon filled={isWatchlisted(selectedMovie.id)} />
                      {isWatchlisted(selectedMovie.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="section-title">Similar Movies You Might Like</h3>
            <div className="movie-grid">
              {recommendations.map(movie => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onClick={() => selectMovieDirectly(movie.title)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 2. Genre Movies Grid */}
        {!loading && !selectedMovie && selectedGenre && activeTab === 'home' && (
          <div>
            <h3 className="section-title">{selectedGenre} Movies</h3>
            {genreMovies.length > 0 ? (
              <div className="movie-grid">
                {genreMovies.map(movie => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    onClick={() => selectMovieDirectly(movie.title)}
                  />
                ))}
              </div>
            ) : (
              <p style={{color: 'var(--text-muted)', textAlign: 'center', padding: '3rem'}}>No movies found in this genre.</p>
            )}
          </div>
        )}

        {/* 3. Homepage Default (Trending list) */}
        {!loading && !selectedMovie && !selectedGenre && trending.length > 0 && activeTab === 'home' && (
          <div>
            <h3 className="section-title">Trending Now</h3>
            <div className="movie-grid">
              {trending.map(movie => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onClick={() => selectMovieDirectly(movie.title)} 
                />
              ))}
            </div>
          </div>
        )}

        {/* 4. Watchlist Grid */}
        {activeTab === 'watchlist' && (
          <div>
            <h3 className="section-title">Your Watchlist</h3>
            {watchlist.length > 0 ? (
              <div className="movie-grid">
                {watchlist.map(movie => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    onClick={() => selectMovieDirectly(movie.title)} 
                  />
                ))}
              </div>
            ) : (
              <div style={{textAlign: 'center', padding: '5rem 2rem', background: 'var(--surface-color)', borderRadius: '24px', border: '1px solid var(--border-light)'}}>
                <HeartIcon filled={false} />
                <h4 style={{fontSize: '1.4rem', marginTop: '1rem', marginBottom: '0.5rem'}}>Your Watchlist is empty</h4>
                <p style={{color: 'var(--text-muted)'}}>Explore movies on the homepage and click "Add to Watchlist" to save them here.</p>
                <button 
                  className="watchlist-btn" 
                  style={{marginTop: '1.5rem'}}
                  onClick={() => setActiveTab('home')}
                >
                  Browse Movies
                </button>
              </div>
            )}
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
