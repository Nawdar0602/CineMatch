import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchMovieDetails } from '../services/api';
import { addToWatchlist } from '../services/watchlistService';
import { useWatchlistStore } from '../stores/watchlistStore';

// Uitgebreide versie van Movie type uit movieStore.ts
interface MovieDetails {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  runtime?: number;
  tagline?: string;
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
    }[];
  };
}

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useWatchlistStore();
  
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedToWatchlist, setAddedToWatchlist] = useState(false);
  
  useEffect(() => {
    const loadMovieDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const movieData = await fetchMovieDetails(parseInt(id));
        setMovie(movieData);
      } catch (err: any) {
        setError(err.message || 'Er is iets misgegaan bij het laden van de filmdetails');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMovieDetails();
  }, [id]);
  
  const handleAddToWatchlist = async () => {
    if (!movie) return;
    
    try {
      const watchlistItem = await addToWatchlist(movie);
      addItem(watchlistItem);
      setAddedToWatchlist(true);
      
      // Reset na 3 seconden
      setTimeout(() => {
        setAddedToWatchlist(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Er is iets misgegaan bij het toevoegen aan je watchlist');
    }
  };
  
  // Haal regisseur uit crew
  const director = movie?.credits?.crew.find(person => person.job === 'Director');
  
  // Formateer runtime naar uren en minuten
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}u ${mins}m`;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pb-8">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-text">Film laden...</p>
        </div>
      ) : error ? (
        <div className="p-4">
          <div className="bg-red-500 bg-opacity-20 text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      ) : movie ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Backdrop header */}
          <div className="relative h-80 md:h-[500px] overflow-hidden">
            {movie.backdrop_path ? (
              <div className="absolute inset-0">
                <img 
                  src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-transparent to-gray-900/40" />
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
            )}
            
            <div className="absolute top-6 left-6">
              <motion.button
                onClick={() => navigate(-1)}
                className="bg-black/60 backdrop-blur-sm text-white p-3 rounded-full shadow-lg hover:bg-black/80 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
            </div>
          </div>
          
          {/* Content */}
          <div className="px-6 -mt-32 relative z-10">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <motion.img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title}
                  className="w-full max-w-sm mx-auto md:mx-0 h-auto rounded-xl shadow-2xl border-4 border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                />
              </div>
              
              <div className="md:w-2/3 text-center md:text-left">
                <motion.h1 
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {movie.title}
                </motion.h1>
                
                {movie.tagline && (
                  <motion.p 
                    className="text-gray-300 italic text-lg mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    "{movie.tagline}"
                  </motion.p>
                )}
                
                <motion.div 
                  className="flex flex-wrap justify-center md:justify-start gap-2 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {movie.genres.map(genre => (
                    <span 
                      key={genre.id}
                      className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-white px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {genre.name}
                    </span>
                  ))}
                </motion.div>
                
                <motion.div 
                  className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 px-4 py-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span className="text-yellow-400 font-bold text-lg">{movie.vote_average.toFixed(1)}</span>
                    <span className="text-gray-400 ml-1">/10</span>
                  </div>
                  
                  <div className="flex items-center text-gray-300 bg-gray-800/50 px-4 py-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                  
                  {movie.runtime && (
                    <div className="flex items-center text-gray-300 bg-gray-800/50 px-4 py-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{formatRuntime(movie.runtime)}</span>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
            
            {/* Acties */}
            <motion.div 
              className="flex mt-8 justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                onClick={handleAddToWatchlist}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center min-w-[280px]"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Toevoegen aan watchlist
              </motion.button>
            </motion.div>
            
            {addedToWatchlist && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500 bg-opacity-20 text-green-300 px-4 py-3 rounded-lg mt-3 text-center"
              >
                Film toegevoegd aan je watchlist!
              </motion.div>
            )}
            
            {/* Synopsis */}
            <motion.div 
              className="mt-12 bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Synopsis
              </h2>
              <p className="text-gray-200 leading-relaxed text-lg">{movie.overview}</p>
            </motion.div>
            
            {/* Cast */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Cast
                </h2>
                <div className="overflow-x-auto">
                  <div className="flex space-x-6 pb-4">
                    {movie.credits?.cast?.slice(0, 10).map((person, index) => (
                      <motion.div 
                        key={person.id} 
                        className="flex-shrink-0 w-32"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 + index * 0.1 }}
                      >
                        <div className="w-32 h-32 rounded-xl bg-gray-800/50 border border-gray-700/50 overflow-hidden mb-3 shadow-lg">
                          {person.profile_path ? (
                            <img 
                              src={`https://image.tmdb.org/t/p/w200${person.profile_path}`} 
                              alt={person.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="text-white text-sm font-semibold truncate mb-1">{person.name}</p>
                        <p className="text-gray-400 text-xs truncate">{person.character}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Crew */}
            {director && (
              <motion.div 
                className="mt-8 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Crew
                </h2>
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
                  <p className="text-white font-semibold text-lg">{director.name}</p>
                  <p className="text-blue-300 text-sm font-medium mt-1">Regisseur</p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="p-4">
          <p className="text-text">Film niet gevonden</p>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;