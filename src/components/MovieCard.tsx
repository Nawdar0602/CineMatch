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
  const dragControls = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Bepaal de swipe-richting op basis van drag-positie
  const updateDragDirection = (x: number, y: number) => {
    dragControls.current = { x, y };
    
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
  
  // Verwerk de swipe-actie bij het loslaten
  const handleDragEnd = (event: any, info: any) => {
    const { x, y } = info.offset;
    
    if (Math.abs(y) > Math.abs(x) && y < -100) {
      setExitDirection('superlike');
      handleSwipe('superlike');
    } else if (x > 100) {
      setExitDirection('like');
      handleSwipe('like');
    } else if (x < -100) {
      setExitDirection('dislike');
      handleSwipe('dislike');
    }
    
    setDragDirection(null);
    dragControls.current = { x: 0, y: 0 };
  };
  
  // Animatie-varianten voor de kaart
  const cardVariants = {
    active: { scale: 1, opacity: 1, rotateZ: 0 },
    inactive: { scale: 0.95 - index * 0.05, opacity: 1 - index * 0.2, rotateZ: 0, y: -10 * index },
    exit: {
      x: exitDirection === 'like' ? 1000 : exitDirection === 'dislike' ? -1000 : 0,
      y: exitDirection === 'superlike' ? -1000 : 0,
      opacity: 0,
      rotateZ: exitDirection === 'like' ? 30 : exitDirection === 'dislike' ? -30 : 0,
      transition: { duration: 0.5, type: 'spring', stiffness: 200, damping: 15 }
    }
  };
  
  // Bereken de juiste URL voor de poster
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=Geen+poster';
  
  return (
    <motion.div
      className={`absolute w-full max-w-sm mx-auto rounded-xl overflow-hidden shadow-xl ${active ? 'z-10' : 'z-0'}`}
      variants={cardVariants}
      initial="inactive"
      animate={active ? 'active' : 'inactive'}
      exit="exit"
      drag={active}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      whileDrag={{ scale: 1.05 }}
      onDrag={(_, info) => updateDragDirection(info.offset.x, info.offset.y)}
      onDragEnd={handleDragEnd}
      onClick={active ? handleTap : undefined}
      style={{ touchAction: 'none' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="relative h-[70vh] bg-gray-900">
        {/* Swipe indicators */}
        {active && dragDirection && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            {dragDirection === 'like' && (
              <div className="absolute top-10 right-10 bg-green-500 text-white px-6 py-3 rounded-lg transform rotate-12 text-xl font-bold border-2 border-white shadow-lg">
                LIKE
              </div>
            )}
            {dragDirection === 'dislike' && (
              <div className="absolute top-10 left-10 bg-red-500 text-white px-6 py-3 rounded-lg transform -rotate-12 text-xl font-bold border-2 border-white shadow-lg">
                NOPE
              </div>
            )}
            {dragDirection === 'superlike' && (
              <div className="absolute top-10 bg-blue-500 text-white px-6 py-3 rounded-lg text-xl font-bold border-2 border-white shadow-lg">
                SUPER LIKE
              </div>
            )}
          </div>
        )}
        
        {/* Poster */}
        <img 
          src={posterUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-90" />
        
        {/* Movie info */}
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
            
            <span className="text-white/80 text-sm">
              {new Date(movie.release_date).getFullYear()}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres.map(genre => (
              <span key={genre.id} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white shadow-lg">
                {genre.name}
              </span>
            ))}
          </div>
          
          <p className="text-white/90 text-sm line-clamp-3 leading-relaxed">{movie.overview}</p>
        </div>
        
        {/* Swipe indicators */}
        {active && (
          <>
            {/* Like indicator */}
            <div 
              className={`absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg font-bold transform rotate-12 transition-opacity ${dragDirection === 'like' ? 'opacity-100' : 'opacity-0'}`}
            >
              LIKE
            </div>
            
            {/* Dislike indicator */}
            <div 
              className={`absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg font-bold transform -rotate-12 transition-opacity ${dragDirection === 'dislike' ? 'opacity-100' : 'opacity-0'}`}
            >
              NOPE
            </div>
            
            {/* Super Like indicator */}
            <div 
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg font-bold transition-opacity ${dragDirection === 'superlike' ? 'opacity-100' : 'opacity-0'}`}
            >
              SUPER LIKE
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default MovieCard;