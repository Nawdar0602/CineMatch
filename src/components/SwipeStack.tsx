import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';
import { useMovieStore } from '../stores/movieStore';

const SwipeStack: React.FC = () => {
  const navigate = useNavigate();
  const { movies, currentIndex, handleSwipe } = useMovieStore();

  const visibleMovies = movies.slice(currentIndex, currentIndex + 3);

  const handleTap = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="relative h-[80vh] w-full max-w-sm mx-auto">
      <AnimatePresence>
        {visibleMovies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            index={index}
            active={index === 0}
            handleSwipe={handleSwipe}
            handleTap={() => handleTap(movie.id)}
          />
        ))}
      </AnimatePresence>

      {/* Swipe buttons */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
        <button
          onClick={() => handleSwipe('dislike')}
          className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <button
          onClick={() => handleSwipe('superlike')}
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>

        <button
          onClick={() => handleSwipe('like')}
          className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SwipeStack;
