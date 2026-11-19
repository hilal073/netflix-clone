import { useState, useEffect } from 'react';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { getImageUrl } from '../api/tmdb';

export default function Banner({ movie, onSelectMovie }) {
  const [isMuted, setIsMuted] = useState(true);

  if (!movie) {
    return (
      <div className="h-[65vh] md:h-[80vh] w-full bg-gradient-to-b from-gray-900 to-[#141414] animate-pulse flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const title = movie.title || movie.name || movie.original_name || 'Featured Movie';
  const overview = movie.overview || 'Stream popular movies, series, and documentaries on Netflix.';
  const backdropUrl = getImageUrl(movie.backdrop_path, 'backdrop');

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str;
  };

  return (
    <header className="relative h-[70vh] md:h-[82vh] w-full text-white overflow-hidden select-none">
      {/* Background Poster Image */}
      <div className="absolute inset-0">
        <img
          src={backdropUrl}
          alt={title}
          className="w-full h-full object-cover object-center filter brightness-90 transition-transform duration-1000 scale-100"
        />
        {/* Subtle dynamic gradients for cinematic Netflix look */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/60 to-transparent w-full md:w-3/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30" />
      </div>

      {/* Banner Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-28 px-4 md:px-12 max-w-2xl md:max-w-3xl space-y-4">
        {/* Netflix Original Badge */}
        <div className="flex items-center space-x-2">
          <span className="bg-[#E50914] text-white font-bold text-xs px-2 py-0.5 rounded tracking-wider">
            N SERIES
          </span>
          <span className="text-xs uppercase tracking-widest text-gray-300 font-semibold drop-shadow">
            TOP 10 TODAY
          </span>
        </div>

        {/* Movie Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight drop-shadow-lg leading-tight">
          {title}
        </h1>

        {/* Metadata snippet */}
        <div className="flex items-center space-x-3 text-xs md:text-sm text-gray-300">
          <span className="text-emerald-400 font-semibold">
            {movie.match || (movie.vote_average ? `${Math.round(movie.vote_average * 10)}% Match` : '98% Match')}
          </span>
          <span>{movie.release_date?.substring(0, 4) || movie.first_air_date?.substring(0, 4) || '2024'}</span>
          <span className="border border-gray-400 px-1 py-0.2 rounded text-[10px]">
            {movie.maturity || 'TV-MA'}
          </span>
          <span>{movie.duration || 'Full HD'}</span>
        </div>

        {/* Overview */}
        <p className="text-sm md:text-base text-gray-200 line-clamp-3 md:line-clamp-4 leading-relaxed drop-shadow">
          {truncate(overview, 180)}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={() => onSelectMovie(movie, true)}
            className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-200 text-black font-bold px-5 md:px-7 py-2 md:py-2.5 rounded transition-all transform active:scale-95 shadow-md cursor-pointer"
          >
            <Play size={20} className="fill-black" />
            <span className="text-sm md:text-base">Play</span>
          </button>

          <button
            onClick={() => onSelectMovie(movie, false)}
            className="flex items-center justify-center space-x-2 bg-gray-600/70 hover:bg-gray-600/50 text-white font-semibold px-5 md:px-6 py-2 md:py-2.5 rounded transition-all backdrop-blur-sm active:scale-95 cursor-pointer"
          >
            <Info size={20} />
            <span className="text-sm md:text-base">More Info</span>
          </button>
        </div>
      </div>

      {/* Floating Sound and Maturity Indicator on Right */}
      <div className="hidden md:flex absolute right-0 bottom-24 items-center space-x-3 pr-12 z-20">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="w-10 h-10 rounded-full border border-gray-400/60 bg-black/40 hover:bg-black/70 flex items-center justify-center text-white backdrop-blur-sm cursor-pointer transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <div className="bg-[#181818]/80 border-l-3 border-gray-300 py-1 px-3 text-xs font-semibold text-gray-200 tracking-wider">
          {movie.maturity || 'TV-14'}
        </div>
      </div>
    </header>
  );
}
