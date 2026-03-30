import React from 'react';
import { motion } from 'framer-motion';
import { Movie } from '../stores/movieStore';

type MovieCardProps = {
  movie: Movie;
  index: number;
  active: boolean;
  handleSwipe: (direction: 'like' | 'dislike' | 'superlike') => void;
  handleTap: () => void;
};

const MovieCard: React.FC<MovieCardProps> = ({ movie, index, active, handleSwipe, handleTap }) => {
  const [exitDirection, setExitDirection] = React.useState<string | null>(null);
  const [dragDirection, setDragDirection] = React.useState<string | null>(null);
  const isDragging = React.useRef(false);
  const hasSwiped = React.useRef(false);

  const triggerSwipe = (direction: 'like' | 'dislike' | 'superlike') => {
    if (hasSwiped.current) return;
    hasSwiped.current = true;
    setExitDirection(direction);
    setTimeout(() => handleSwipe(direction), 350);
  };

  const updateDragDirection = (x: number, y: number) => {
    isDragging.current = true;
    if (Math.abs(x) < 50 && Math.abs(y) < 50) {
      setDragDirection(null);
      return;
    }
    if (Math.abs(y) > Math.abs(x) && y < -50) {
      setDragDirection('superlike');
    } else if (x > 50) {
      setDragDirection('like');
    } else if (x < -50) {
      setDragDirection('dislike');
    } else {
      setDragDirection(null);
    }
  };

  const handleDragEnd = (_event: any, info: any) => {
    const { x, y } = info.offset;
    if (Math.abs(y) > Math.abs(x) && y < -100) {
      triggerSwipe('superlike');
    } else if (x > 100) {
      triggerSwipe('like');
    } else if (x < -100) {
      triggerSwipe('dislike');
    }
    setDragDirection(null);
    setTimeout(() => { isDragging.current = false; }, 50);
  };

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=Geen+poster';

  const exitX = exitDirection === 'like' ? 1000 : exitDirection === 'dislike' ? -1000 : 0;
  const exitY = exitDirection === 'superlike' ? -1000 : 0;
  const exitRotate = exitDirection === 'like' ? 30 : exitDirection === 'dislike' ? -30 : 0;

  return (
    <motion.div
      className={`absolute w-full max-w-sm mx-auto rounded-xl overflow-hidden shadow-xl ${active ? 'z-10' : 'z-0'}`}
      initial={{ scale: 0.95 - index * 0.05, opacity: 1 - index * 0.2, y: -10 * index }}
      animate={
        exitDirection
          ? { x: exitX, y: exitY, opacity: 0, rotateZ: exitRotate, transition: { duration: 0.4, type: 'spring', stiffness: 200, damping: 20 } }
          : { scale: active ? 1 : 0.95 - index * 0.05, opacity: 1 - index * 0.2, y: active ? 0 : -10 * index, rotateZ: 0 }
      }
      drag={active && !exitDirection}
      dragElastic={1}
      whileDrag={{ scale: 1.05 }}
      onDrag={(_, info) => updateDragDirection(info.offset.x, info.offset.y)}
      onDragEnd={handleDragEnd}
      onClick={active ? () => { if (!isDragging.current) handleTap(); } : undefined}
      style={{ touchAction: 'none' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="relative h-[70vh] bg-gray-900">
        {/* Swipe indicators */}
        {active && (
          <>
            <div className={`absolute top-10 right-10 bg-green-500 text-white px-6 py-3 rounded-lg transform rotate-12 text-xl font-bold border-2 border-white shadow-lg transition-opacity z-20 ${dragDirection === 'like' ? 'opacity-100' : 'opacity-0'}`}>
              LIKE
            </div>
            <div className={`absolute top-10 left-10 bg-red-500 text-white px-6 py-3 rounded-lg transform -rotate-12 text-xl font-bold border-2 border-white shadow-lg transition-opacity z-20 ${dragDirection === 'dislike' ? 'opacity-100' : 'opacity-0'}`}>
              NOPE
            </div>
            <div className={`absolute top-10 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-lg text-xl font-bold border-2 border-white shadow-lg transition-opacity z-20 ${dragDirection === 'superlike' ? 'opacity-100' : 'opacity-0'}`}>
              SUPER LIKE
            </div>
          </>
        )}

        <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />

        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-90" />

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
          <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{movie.title}</h2>

          <div className="flex items-center mb-3">
            <span className="text-yellow-400 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
            <span className="text-white text-lg font-semibold">{movie.vote_average.toFixed(1)}</span>
            <span className="text-white/60 text-sm ml-1">/10</span>
            <span className="mx-3 text-white/40">•</span>
            <span className="text-white/80 text-sm">{new Date(movie.release_date).getFullYear()}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres.slice(0, 2).map(genre => (
              <span key={genre.id} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white shadow-lg">
                {genre.name}
              </span>
            ))}
          </div>

          <p className="text-white/90 text-sm line-clamp-3 leading-relaxed">{movie.overview}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;
