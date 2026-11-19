import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { fetchCategoryMovies } from '../api/tmdb';

export default function MovieRow({ title, categoryId, fetchUrl, isLargeRow = false, onSelectMovie, customMovies = null }) {
  const [movies, setMovies] = useState(customMovies || []);
  const [loading, setLoading] = useState(!customMovies);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const rowRef = useRef(null);

  useEffect(() => {
    if (customMovies) {
      setMovies(customMovies);
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const results = await fetchCategoryMovies(fetchUrl, categoryId);
      if (isMounted) {
        setMovies(results);
        setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [fetchUrl, categoryId, customMovies]);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      const targetScroll = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      rowRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  const checkScrollPosition = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 20);
    }
  };

  if (!loading && (!movies || movies.length === 0)) {
    return null;
  }

  return (
    <div className="space-y-2 md:space-y-3 px-4 md:px-12 my-6 md:my-8 group select-none">
      {/* Category Header */}
      <h3 className="text-lg md:text-xl font-bold text-gray-100 hover:text-white transition-colors cursor-pointer inline-flex items-center space-x-1">
        <span>{title}</span>
        <span className="text-xs text-emerald-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          Explore all &gt;
        </span>
      </h3>

      {/* Row Carousel Area */}
      <div className="relative">
        {/* Left Scroll Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer rounded-r"
            aria-label="Scroll left"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Horizontal Container */}
        <div
          ref={rowRef}
          onScroll={checkScrollPosition}
          className="flex items-center space-x-3 md:space-x-4 overflow-x-auto no-scrollbar scroll-smooth py-2"
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`bg-gray-800/60 animate-pulse rounded-md flex-none ${
                    isLargeRow
                      ? 'w-[150px] sm:w-[190px] md:w-[220px] aspect-[2/3]'
                      : 'w-[200px] sm:w-[250px] md:w-[290px] aspect-video'
                  }`}
                />
              ))
            : movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isLargeRow={isLargeRow}
                  onSelectMovie={onSelectMovie}
                />
              ))}
        </div>

        {/* Right Scroll Arrow */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-0 bottom-0 z-30 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer rounded-l"
            aria-label="Scroll right"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>
    </div>
  );
}
