import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';
import { Movie, useMovieStore } from '../stores/movieStore';
import { useFriendStore } from '../stores/friendStore';

type SwipeStackProps = {
  movies: Movie[];
};

const SwipeStack: React.FC<SwipeStackProps> = ({ movies }) => {
  const navigate = useNavigate();
  const { handleSwipe } = useMovieStore();
  const { matches, addMatch } = useFriendStore();
  
  const [showMatch, setShowMatch] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<any>(null);
  
  // Verwerk swipe actie
  const handleSwipeAction = (direction: 'like' | 'dislike' | 'superlike') => {
    handleSwipe(direction);
    
    // In een echte app zou hier een API call worden gemaakt om de swipe te registreren
    // en te controleren of er een match is met een vriend
    // Voor nu doen we niets met matches omdat we geen fictieve gebruikers meer willen tonen
  };
  
  const handleTap = () => {
    // Navigeer naar de detailpagina van de film
    if (movies.length > 0) {
      navigate(`/movie/${movies[0].id}`);
    }
  };
  
  const handleCloseMatch = () => {
    setShowMatch(false);
    setCurrentMatch(null);
  };
  
  return (
    <div className="relative h-[80vh] w-full max-w-sm mx-auto">
      {/* Swipe cards */}
      <AnimatePresence>
        {movies.slice(0, 3).map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            index={index}
            active={index === 0}
            handleSwipe={handleSwipeAction}
            handleTap={handleTap}
          />
        ))}
      </AnimatePresence>
      
      {/* Swipe buttons */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
        <button 
          onClick={() => handleSwipeAction('dislike')}
          className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <button 
          onClick={() => handleSwipeAction('superlike')}
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        
        <button 
          onClick={() => handleSwipeAction('like')}
          className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      {/* Match popup */}
      <AnimatePresence>
        {showMatch && currentMatch && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="bg-card rounded-xl overflow-hidden max-w-md w-full text-center shadow-2xl"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="p-8 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                <motion.h2 
                  className="text-3xl font-bold text-white mb-3"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  Het is een match!
                </motion.h2>
                <motion.p 
                  className="text-white opacity-90 text-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                >
                  Jullie houden allebei van deze film
                </motion.p>
              </div>
              
              <div className="p-8">
                <div className="flex justify-center -mt-16 mb-6">
                  <motion.div 
                    className="relative"
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, type: 'spring', damping: 12 }}
                  >
                    <img 
                      src={`https://image.tmdb.org/t/p/w200${currentMatch.movie.poster_path}`}
                      alt={currentMatch.movie.title}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    
                    {matches.map(match => {
                      if (match.friendId === currentMatch.friendId) {
                        return (
                          <motion.img 
                            key={match.id}
                            src={match.friend.profilePicture}
                            alt={match.friend.username}
                            className="w-20 h-20 rounded-full object-cover border-4 border-white absolute -right-10 top-0 shadow-lg"
                            initial={{ scale: 0, rotate: 30, x: -20 }}
                            animate={{ scale: 1, rotate: 0, x: 0 }}
                            transition={{ delay: 0.5, type: 'spring', damping: 12 }}
                          />
                        );
                      }
                      return null;
                    })}
                  </motion.div>
                </div>
                
                <motion.h3 
                  className="text-xl font-bold text-text mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {currentMatch.movie.title}
                </motion.h3>
                <motion.p 
                  className="text-text opacity-70 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {matches.map(match => {
                    if (match.friendId === currentMatch.friendId) {
                      return match.friend.username;
                    }
                    return null;
                  })}
                </motion.p>
                
                <motion.div 
                  className="flex space-x-3"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <button 
                    onClick={handleCloseMatch}
                    className="flex-1 px-4 py-3 bg-gray-200 rounded-lg text-gray-800 font-medium hover:bg-gray-300 transition-colors"
                  >
                    Later
                  </button>
                  
                  <button 
                    onClick={handleCloseMatch}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-medium hover:from-pink-600 hover:to-purple-600 transition-colors shadow-lg"
                  >
                    Stuur bericht
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SwipeStack;