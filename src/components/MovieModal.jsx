import { useState, useEffect } from 'react';
import {
  X,
  Play,
  Plus,
  Check,
  ThumbsUp,
  ExternalLink,
  Volume2,
} from 'lucide-react';
import { getImageUrl } from '../api/tmdb';
import { useWatchlist } from '../context/WatchlistContext';

export default function MovieModal({ movie, autoplay = true, onClose }) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isLiked, setIsLiked] = useState(false);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  if (!movie) return null;

  const inList = isInWatchlist(movie.id);
  const title = movie.title || movie.name || 'Untitled';
  const backdropUrl = getImageUrl(movie.backdrop_path, 'backdrop');
  const trailerId = movie.trailer_id || 'b9EkMc79ZSU';

  // YouTube embed URL with autoplay, sound and clean controls
  const embedUrl = `https://www.youtube-nocookie.com/embed/${trailerId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`;

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      {/* Modal Card */}
      <div
        className="relative w-full max-w-4xl bg-[#181818] rounded-xl overflow-hidden shadow-2xl border border-gray-800 my-auto text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 w-9 h-9 rounded-full bg-[#181818]/90 hover:bg-[#282828] text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20 shadow-lg"
          title="Close (Esc)"
        >
          <X size={20} />
        </button>

        {/* Video / Trailer Area */}
        <div className="relative aspect-video w-full bg-black overflow-hidden select-none">
          {isPlaying ? (
            /* Active YouTube Official Trailer Embed */
            <div className="relative w-full h-full">
              <iframe
                className="w-full h-full border-0"
                src={embedUrl}
                title={`${title} Official Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

              {/* Direct YouTube Link pill in top corner */}
              <a
                href={`https://www.youtube.com/watch?v=${trailerId}`}
                target="_blank"
                rel="noreferrer"
                className="absolute top-4 left-4 z-30 bg-black/70 hover:bg-black/90 text-white text-xs px-3 py-1.5 rounded-full flex items-center space-x-1.5 backdrop-blur-sm border border-white/20 transition-colors shadow"
              >
                <span>{title} Official Trailer</span>
                <ExternalLink size={12} />
              </a>
            </div>
          ) : (
            /* Backdrop with Big Centered Play Button */
            <div className="relative w-full h-full group">
              <img
                src={
                  backdropUrl ||
                  'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1200&auto=format&fit=crop'
                }
                alt={title}
                className="w-full h-full object-cover brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/40" />

              {/* Centered Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E50914] hover:bg-[#F40612] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-2xl cursor-pointer"
                  title="Play Official Trailer"
                >
                  <Play size={32} className="fill-white ml-1" />
                </button>
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-6 left-6 z-20">
                <span className="bg-[#E50914] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider mb-2 inline-block">
                  TRAILER
                </span>
                <h3 className="text-2xl sm:text-3xl font-black drop-shadow-lg">
                  {title}
                </h3>
              </div>
            </div>
          )}
        </div>

        {/* Modal Info Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Main Title & Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{title}</h2>
              <div className="flex items-center space-x-3 text-sm text-gray-300 mt-2">
                <span className="text-emerald-400 font-bold">
                  {movie.match || (movie.vote_average ? `${Math.round(movie.vote_average * 10)}% Match` : '98% Match')}
                </span>
                <span>
                  {movie.release_date?.substring(0, 4) ||
                    movie.first_air_date?.substring(0, 4) ||
                    '2024'}
                </span>
                <span className="border border-gray-500 px-1.5 py-0.5 rounded text-xs">
                  {movie.maturity || 'TV-MA'}
                </span>
                <span className="bg-white/10 px-1.5 py-0.5 rounded text-xs text-gray-200">
                  {movie.duration || 'Full HD 1080p'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center space-x-2 bg-white hover:bg-gray-200 text-black font-bold px-5 py-2 rounded transition-all cursor-pointer shadow"
              >
                <Play size={16} className="fill-black" />
                <span className="text-sm">{isPlaying ? 'Replay' : 'Play Trailer'}</span>
              </button>

              <button
                onClick={() => toggleWatchlist(movie)}
                className={`flex items-center space-x-2 px-4 py-2 rounded border transition-all text-sm font-semibold cursor-pointer ${
                  inList
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'border-gray-500 hover:border-white bg-[#2a2a2a]/80 text-white'
                }`}
              >
                {inList ? <Check size={16} /> : <Plus size={16} />}
                <span>{inList ? 'In My List' : 'Add to List'}</span>
              </button>

              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                  isLiked
                    ? 'bg-white text-black border-white'
                    : 'border-gray-500 hover:border-white bg-[#2a2a2a]/80 text-white'
                }`}
                title={isLiked ? 'Liked' : 'Like'}
              >
                <ThumbsUp size={16} className={isLiked ? 'fill-black' : ''} />
              </button>

              {/* Direct Open in YouTube */}
              <a
                href={`https://www.youtube.com/watch?v=${trailerId}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-gray-500 hover:border-white bg-[#2a2a2a]/80 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                title="Watch on YouTube"
              >
                <ExternalLink size={15} />
              </a>
            </div>
          </div>

          {/* Synopsis and Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-gray-800">
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                Synopsis
              </h4>
              <p className="text-gray-200 text-sm md:text-base leading-relaxed">
                {movie.overview || 'No synopsis available for this title.'}
              </p>
            </div>

            <div className="space-y-3 text-xs md:text-sm text-gray-400 border-l border-gray-800/80 pl-0 md:pl-6">
              <div>
                <span className="text-gray-500">Audio: </span>
                <span className="text-gray-300">English [Original], Dolby Atmos 5.1</span>
              </div>
              <div>
                <span className="text-gray-500">Subtitles: </span>
                <span className="text-gray-300">English, Spanish, French, German</span>
              </div>
              <div>
                <span className="text-gray-500">Genres: </span>
                <span className="text-gray-300">
                  {movie.genres?.join(', ') || 'Action, Sci-Fi, Drama'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Status: </span>
                <span className="text-emerald-400 font-semibold">Available to Stream</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
