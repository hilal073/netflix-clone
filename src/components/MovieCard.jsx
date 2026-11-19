import { useState } from 'react';
import { Play, Plus, Check, Info } from 'lucide-react';
import { getImageUrl } from '../api/tmdb';
import { useWatchlist } from '../context/WatchlistContext';

export default function MovieCard({ movie, isLargeRow, onSelectMovie }) {
  const [isHovered, setIsHovered] = useState(false);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inList = isInWatchlist(movie.id);

  const title = movie.title || movie.name || 'Untitled';
  const imagePath = isLargeRow ? (movie.poster_path || movie.backdrop_path) : (movie.backdrop_path || movie.poster_path);
  const imageUrl = getImageUrl(imagePath, isLargeRow ? 'poster' : 'backdrop');

  return (
    <div
      className={`relative flex-none rounded-md overflow-hidden cursor-pointer transition-all duration-300 ease-out group select-none ${
        isLargeRow
          ? 'w-[150px] sm:w-[190px] md:w-[220px] aspect-[2/3]'
          : 'w-[200px] sm:w-[250px] md:w-[290px] aspect-video'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelectMovie(movie, false)}
    >
      {/* Movie Image */}
      <img
        src={imageUrl || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=600&auto=format&fit=crop'}
        alt={title}
        loading="lazy"
        className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
      />

      {/* Netflix Original N badge for large rows */}
      {isLargeRow && (
        <div className="absolute top-2 left-2 z-10">
          <span className="text-[#E50914] font-black text-lg drop-shadow">N</span>
        </div>
      )}

      {/* Hover Information Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-3 flex flex-col justify-end transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <h4 className="text-white text-xs sm:text-sm font-bold truncate drop-shadow mb-1">
          {title}
        </h4>

        {/* Action icons row */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center space-x-2">
            {/* Quick Play Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectMovie(movie, true);
              }}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white hover:bg-gray-200 text-black flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow"
              title="Play Trailer"
            >
              <Play size={14} className="fill-black ml-0.5" />
            </button>

            {/* Watchlist Toggle Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWatchlist(movie);
              }}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-400 flex items-center justify-center transition-colors cursor-pointer ${
                inList ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-[#2a2a2a]/80 hover:border-white text-white'
              }`}
              title={inList ? 'Remove from My List' : 'Add to My List'}
            >
              {inList ? <Check size={14} /> : <Plus size={14} />}
            </button>

            {/* More info */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectMovie(movie, false);
              }}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-400 bg-[#2a2a2a]/80 hover:border-white text-white flex items-center justify-center transition-colors cursor-pointer"
              title="More Info"
            >
              <Info size={14} />
            </button>
          </div>
        </div>

        {/* Rating and Genre */}
        <div className="flex items-center space-x-2 mt-2 text-[10px] sm:text-xs">
          <span className="text-emerald-400 font-semibold">
            {movie.vote_average ? `${Math.round(movie.vote_average * 10)}% Match` : '96% Match'}
          </span>
          <span className="border border-gray-600 px-1 py-0.2 rounded text-gray-300">
            {movie.maturity || 'HD'}
          </span>
        </div>
      </div>
    </div>
  );
}
