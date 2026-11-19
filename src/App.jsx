import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import MovieRow from './components/MovieRow';
import MovieCard from './components/MovieCard';
import MovieModal from './components/MovieModal';
import CategoryHeader from './components/CategoryHeader';
import SignIn from './components/SignIn';
import Footer from './components/Footer';
import { WatchlistProvider, useWatchlist } from './context/WatchlistContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { requests, fetchCategoryMovies, tmdbAxios } from './api/tmdb';
import { MOCK_MOVIES } from './api/mockData';
import { Film } from 'lucide-react';

function NetflixMain() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [bannerMovie, setBannerMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalAutoplay, setModalAutoplay] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [watchlistFilter, setWatchlistFilter] = useState('all');
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const { watchlist } = useWatchlist();
  const { isAuthenticated } = useAuth();

  // Scroll to top and reset genre on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedGenre(null);
  }, [activeTab]);

  // Load hero banner title specific to current tab
  useEffect(() => {
    let isCurrent = true;

    async function loadBanner() {
      let fetchUrl = requests.fetchTrending;
      let categoryId = 'trending';

      if (activeTab === 'tv') {
        fetchUrl = requests.fetchPopularTV;
        categoryId = 'tv_popular';
      } else if (activeTab === 'movies') {
        fetchUrl = requests.fetchPopularMovies;
        categoryId = 'movies_popular';
      } else if (activeTab === 'new') {
        fetchUrl = requests.fetchTrendingToday;
        categoryId = 'new_today';
      }

      const results = await fetchCategoryMovies(fetchUrl, categoryId);
      if (isCurrent && results && results.length > 0) {
        const randomIndex = Math.floor(Math.random() * Math.min(5, results.length));
        setBannerMovie(results[randomIndex]);
      } else if (isCurrent) {
        setBannerMovie(MOCK_MOVIES[0]);
      }
    }

    loadBanner();
    return () => {
      isCurrent = false;
    };
  }, [activeTab]);

  // Handle Search with Debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const delayDebounce = setTimeout(async () => {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      if (apiKey) {
        try {
          const res = await tmdbAxios.get(requests.search(searchQuery));
          setSearchResults(res.data.results || []);
        } catch (err) {
          console.error('Search error', err);
          const filtered = MOCK_MOVIES.filter((m) =>
            (m.title || m.name || '').toLowerCase().includes(searchQuery.toLowerCase())
          );
          setSearchResults(filtered);
        }
      } else {
        const filtered = MOCK_MOVIES.filter((m) =>
          (m.title || m.name || m.overview || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
      }
      setIsSearching(false);
    }, 350);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSelectMovie = (movie, autoplay = false) => {
    setSelectedMovie(movie);
    setModalAutoplay(autoplay);
  };

  // Filter watchlist items
  const filteredWatchlist = watchlist.filter((item) => {
    if (watchlistFilter === 'movies') return item.media_type === 'movie' || item.release_date;
    if (watchlistFilter === 'tv') return item.media_type === 'tv' || item.first_air_date;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col font-sans selection:bg-[#E50914] selection:text-white">
      {/* Top Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenSignIn={() => setIsSignInOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: ACTIVE LIVE SEARCH RESULTS */}
        {searchQuery.trim() !== '' ? (
          <div className="pt-24 px-4 md:px-12 max-w-7xl mx-auto min-h-[60vh]">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-200">
              Results for <span className="text-white font-extrabold">"{searchQuery}"</span>
            </h2>

            {isSearching ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="aspect-video bg-gray-800 animate-pulse rounded-md" />
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {searchResults.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isLargeRow={false}
                    onSelectMovie={handleSelectMovie}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 text-gray-400 space-y-3">
                <Film size={48} className="mx-auto text-gray-600 mb-2" />
                <p className="text-lg">No movies or TV shows found matching your search.</p>
                <p className="text-xs text-gray-500">Suggestions: Try different keywords or check spelling.</p>
              </div>
            )}
          </div>
        ) : activeTab === 'watchlist' ? (
          /* VIEW 2: MY LIST / WATCHLIST */
          <div className="pt-24 px-4 md:px-12 max-w-7xl mx-auto min-h-[65vh]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-800 gap-4">
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                My List ({filteredWatchlist.length})
              </h2>

              {/* Watchlist Filter Buttons */}
              <div className="flex items-center space-x-2">
                {[
                  { id: 'all', label: 'All Titles' },
                  { id: 'movies', label: 'Movies' },
                  { id: 'tv', label: 'TV Shows' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setWatchlistFilter(f.id)}
                    className={`text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                      watchlistFilter === f.id
                        ? 'bg-white text-black font-bold'
                        : 'bg-[#252525] hover:bg-[#353535] text-gray-300'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredWatchlist.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
                {filteredWatchlist.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isLargeRow={false}
                    onSelectMovie={handleSelectMovie}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-28 text-gray-400 space-y-3">
                <Film size={48} className="mx-auto text-gray-600 mb-2" />
                <p className="text-lg font-medium text-gray-300">Your list is currently empty.</p>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Find movies and TV shows you want to watch later and click the + button to add them here.
                </p>
                <button
                  onClick={() => setActiveTab('movies')}
                  className="mt-4 px-6 py-2 bg-white text-black font-semibold rounded hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Explore Movies
                </button>
              </div>
            )}
          </div>
        ) : activeTab === 'tv' ? (
          /* VIEW 3: TV SHOWS VIEW */
          <>
            <div className="relative">
              <CategoryHeader
                title="TV Shows"
                genres={['Drama', 'Sci-Fi & Fantasy', 'Animation', 'Crime', 'Comedy']}
                selectedGenre={selectedGenre}
                onSelectGenre={setSelectedGenre}
              />
              <Banner movie={bannerMovie} onSelectMovie={handleSelectMovie} />
            </div>

            <div className="-mt-12 md:-mt-24 relative z-20 space-y-2">
              <MovieRow
                title="Popular TV Shows"
                categoryId="tv_popular"
                fetchUrl={requests.fetchPopularTV}
                isLargeRow={true}
                onSelectMovie={handleSelectMovie}
              />
              <MovieRow
                title="Binge-Worthy TV Dramas"
                categoryId="tv_dramas"
                fetchUrl={requests.fetchDramaTV}
                isLargeRow={false}
                onSelectMovie={handleSelectMovie}
              />
              <MovieRow
                title="Sci-Fi & Fantasy Series"
                categoryId="tv_scifi"
                fetchUrl={requests.fetchSciFiTV}
                isLargeRow={false}
                onSelectMovie={handleSelectMovie}
              />
              <MovieRow
                title="Acclaimed Anime & Animation"
                categoryId="tv_anime"
                fetchUrl={requests.fetchAnimationTV}
                isLargeRow={false}
                onSelectMovie={handleSelectMovie}
              />
              <MovieRow
                title="Top Rated TV Series"
                categoryId="tv_top"
                fetchUrl={requests.fetchTopRatedTV}
                isLargeRow={false}
                onSelectMovie={handleSelectMovie}
              />
            </div>
          </>
        ) : activeTab === 'movies' ? (
          /* VIEW 4: MOVIES VIEW */
          <>
            <div className="relative">
              <CategoryHeader
                title="Movies"
                genres={['Action', 'Sci-Fi', 'Thrillers', 'Comedies', 'Award-Winning']}
                selectedGenre={selectedGenre}
                onSelectGenre={setSelectedGenre}
              />
              <Banner movie={bannerMovie} onSelectMovie={handleSelectMovie} />
            </div>

            <div className="-mt-12 md:-mt-24 relative z-20 space-y-2">
              <MovieRow
                title="Blockbuster Movies"
                categoryId="movies_popular"
                fetchUrl={requests.fetchPopularMovies}
                isLargeRow={true}
                onSelectMovie={handleSelectMovie}
              />
              <MovieRow
                title="Critically Acclaimed Movies"
                categoryId="movies_top"
                fetchUrl={requests.fetchTopRatedMovies}
                isLargeRow={false}
                onSelectMovie={handleSelectMovie}
              />
              <MovieRow
                title="Action & Adventure Hits"
                categoryId="movies_action"
                fetchUrl={requests.fetchActionMovies}
                isLargeRow={false}
                onSelectMovie={handleSelectMovie}
              />
              <MovieRow
                title="Mind-Bending Sci-Fi"
                categoryId="movies_scifi"
                fetchUrl={requests.fetchSciFiMovies}
                isLargeRow={false}
                onSelectMovie={handleSelectMovie}
              />
              <MovieRow
                title="Comedy Movies"
                categoryId="comedy"
                fetchUrl={requests.fetchComedyMovies}
                isLargeRow={false}
                onSelectMovie={handleSelectMovie}
              />
              <MovieRow
                title="Horror & Thrillers"
                categoryId="horror"
                fetchUrl={requests.fetchHorrorMovies}
                isLargeRow={false}
                onSelectMovie={handleSelectMovie}
              />
            </div>
          </>
        ) : activeTab === 'new' ? (
          /* VIEW 5: NEW & POPULAR VIEW */
          <>
            <div className="relative">
              <CategoryHeader
                title="New & Popular"
                genres={['Top 10 Today', 'Trending This Week', 'Coming Soon']}
                selectedGenre={selectedGenre}
                onSelectGenre={setSelectedGenre}
              />
              <Banner movie={bannerMovie} onSelectMovie={handleSelectMovie} />
            </div>

            <div className="-mt-12 md:-mt-24 relative z-20 space-y-2">
              <MovieRow
                title="Top 10 Today on Netflix"
                categoryId="new_today"
                fetchUrl={requests.fetchTrendingToday}
                isLargeRow={true}
                onSelectMovie={handleSelectMovie}
              />
              <MovieRow
                title="Trending This Week"
                categoryId="new_trending"
                fetchUrl={requests.fetchTrending}
                isLargeRow={false}
                onSelectMovie={handleSelectMovie}
              />
              <MovieRow
                title="Worth the Wait & Coming Soon"
                categoryId="new_worth_wait"
                fetchUrl={requests.fetchUpcoming}
                isLargeRow={false}
                onSelectMovie={handleSelectMovie}
              />
              <MovieRow
                title="Popular This Month"
                categoryId="top_rated"
                fetchUrl={requests.fetchTopRated}
                isLargeRow={false}
                onSelectMovie={handleSelectMovie}
              />
            </div>
          </>
        ) : (
          /* VIEW 6: DEFAULT HOME VIEW */
          <>
            <Banner movie={bannerMovie} onSelectMovie={handleSelectMovie} />

            <div className="-mt-12 md:-mt-24 relative z-20 space-y-2">
              <MovieRow
                title="Netflix Originals"
                categoryId="originals"
                fetchUrl={requests.fetchNetflixOriginals}
                isLargeRow={true}
                onSelectMovie={handleSelectMovie}
              />
              <MovieRow
                title="Trending Now"
                categoryId="trending"
                fetchUrl={requests.fetchTrending}
                isLargeRow={false}
                onSelectMovie={handleSelectMovie}
              />
              <MovieRow
                title="Top Rated Movies & Series"
                categoryId="top_rated"
                fetchUrl={requests.fetchTopRated}
                isLargeRow={false}
                onSelectMovie={handleSelectMovie}
              />
              <MovieRow
                title="Action & Sci-Fi Thrillers"
                categoryId="action"
                fetchUrl={requests.fetchActionMovies}
                isLargeRow={false}
                onSelectMovie={handleSelectMovie}
              />
              <MovieRow
                title="Comedies"
                categoryId="comedy"
                fetchUrl={requests.fetchComedyMovies}
                isLargeRow={false}
                onSelectMovie={handleSelectMovie}
              />
              <MovieRow
                title="Horror & Mysteries"
                categoryId="horror"
                fetchUrl={requests.fetchHorrorMovies}
                isLargeRow={false}
                onSelectMovie={handleSelectMovie}
              />
              <MovieRow
                title="Documentaries"
                categoryId="docs"
                fetchUrl={requests.fetchDocumentaries}
                isLargeRow={false}
                onSelectMovie={handleSelectMovie}
              />
            </div>
          </>
        )}
      </main>

      {/* Detail & Trailer Video Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          autoplay={modalAutoplay}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      {/* Sign In / Sign Up Modal */}
      {isSignInOpen && <SignIn onClose={() => setIsSignInOpen(false)} />}

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <NetflixMain />
      </WatchlistProvider>
    </AuthProvider>
  );
}
