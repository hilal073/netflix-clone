import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CategoryHeader({ title, genres = [], selectedGenre, onSelectGenre }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-16 md:top-20 left-4 md:left-12 z-30 flex items-center space-x-4 md:space-x-8">
      {/* Category Name */}
      <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
        {title}
      </h1>

      {/* Genres Dropdown & Filter Pills */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 bg-black/70 hover:bg-black/90 text-white border border-white/30 text-xs md:text-sm font-semibold px-3 py-1 rounded transition-colors backdrop-blur-sm cursor-pointer"
        >
          <span>{selectedGenre || 'Genres'}</span>
          <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-2 w-48 sm:w-56 bg-[#181818] border border-gray-700/80 rounded shadow-2xl py-2 z-50 max-h-64 overflow-y-auto">
            <button
              onClick={() => {
                onSelectGenre(null);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-1.5 text-xs sm:text-sm transition-colors cursor-pointer ${
                !selectedGenre ? 'text-[#E50914] font-bold bg-white/5' : 'text-gray-200 hover:bg-white/10'
              }`}
            >
              All Genres
            </button>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => {
                  onSelectGenre(genre);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-1.5 text-xs sm:text-sm transition-colors cursor-pointer ${
                  selectedGenre === genre ? 'text-[#E50914] font-bold bg-white/5' : 'text-gray-200 hover:bg-white/10'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick genre pills on medium/large screens */}
      <div className="hidden lg:flex items-center space-x-2">
        {genres.slice(0, 4).map((genre) => (
          <button
            key={genre}
            onClick={() => onSelectGenre(selectedGenre === genre ? null : genre)}
            className={`text-xs px-2.5 py-1 rounded-full transition-all cursor-pointer ${
              selectedGenre === genre
                ? 'bg-white text-black font-bold'
                : 'bg-black/50 hover:bg-white/20 text-gray-300 border border-white/20'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}
