import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SwipeStack from '../components/SwipeStack';
import FilterBar from '../components/FilterBar';
import { useMovieStore } from '../stores/movieStore';
import { 
  fetchPopularMovies,
  fetchGenres,
  searchMovies,
  fetchMoviesByGenre,
  fetchMoviesByYear,
  fetchMoviesByStreaming
} from '../services/api';

const Discover: React.FC = () => {
  const { movies, currentIndex, setMovies, isLoading, setLoading, error, setError } = useMovieStore();
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  
  // Functie om films te laden
  const loadMovies = async (resetPage: boolean = false) => {
    setLoading(true);
    try {
      const moviesData = await fetchPopularMovies(resetPage);
      setMovies(moviesData);
    } catch (err: any) {
      setError(err.message || 'Er is iets misgegaan bij het laden van films');
    } finally {
      setLoading(false);
    }
  };
  
  // Laad films bij het laden van de pagina
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genresData = await fetchGenres();
        setGenres(genresData);
      } catch (err) {
        console.error('Fout bij het laden van genres:', err);
      }
    };
    
    loadMovies(true); // Reset pagina bij eerste laden
    loadGenres();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Controleer of er nieuwe films geladen moeten worden
  useEffect(() => {
    const remaining = movies.length - currentIndex;
    if (movies.length > 0 && remaining <= 3) {
      loadMovies();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, movies.length]);
  
  // Handlers voor filters
  const handleSearch = async (query: string) => {
    if (!query) {
      // Als de zoekopdracht leeg is, laad populaire films
      setLoading(true);
      try {
        const moviesData = await fetchPopularMovies();
        setMovies(moviesData);
      } catch (err: any) {
        setError(err.message || 'Er is iets misgegaan bij het laden van films');
      } finally {
        setLoading(false);
      }
      return;
    }
    
    setLoading(true);
    try {
      const moviesData = await searchMovies(query);
      setMovies(moviesData);
    } catch (err: any) {
      setError(err.message || 'Er is iets misgegaan bij het zoeken van films');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterByGenre = async (genreId: number | null) => {
    if (genreId === null) {
      // Als geen genre is geselecteerd, laad populaire films
      setLoading(true);
      try {
        const moviesData = await fetchPopularMovies();
        setMovies(moviesData);
      } catch (err: any) {
        setError(err.message || 'Er is iets misgegaan bij het laden van films');
      } finally {
        setLoading(false);
      }
      return;
    }
    
    setLoading(true);
    try {
      const moviesData = await fetchMoviesByGenre(genreId);
      setMovies(moviesData);
    } catch (err: any) {
      setError(err.message || 'Er is iets misgegaan bij het filteren op genre');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterByYear = async (year: number | null) => {
    if (year === null) {
      // Als geen jaar is geselecteerd, laad populaire films
      setLoading(true);
      try {
        const moviesData = await fetchPopularMovies();
        setMovies(moviesData);
      } catch (err: any) {
        setError(err.message || 'Er is iets misgegaan bij het laden van films');
      } finally {
        setLoading(false);
      }
      return;
    }
    
    setLoading(true);
    try {
      const moviesData = await fetchMoviesByYear(year);
      setMovies(moviesData);
    } catch (err: any) {
      setError(err.message || `Er is iets misgegaan bij het filteren op jaar ${year}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterByFriends = async (friendsOnly: boolean) => {
    // Voor nu simuleren we dit met een melding en laden we populaire films
    console.log('Alleen films van vrienden:', friendsOnly);
    
    // In een echte app zou je hier een API call doen om te filteren op vrienden
    // Voor nu laden we gewoon populaire films
    if (friendsOnly) {
      setLoading(true);
      try {
        // Simuleer een vertraging om te laten zien dat er iets gebeurt
        await new Promise(resolve => setTimeout(resolve, 500));
        const moviesData = await fetchPopularMovies();
        setMovies(moviesData);
      } catch (err: any) {
        setError(err.message || 'Er is iets misgegaan bij het laden van films');
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleFilterByStreaming = async (service: string | null) => {
    if (service === null) {
      // Als geen streamingdienst is geselecteerd, laad populaire films
      setLoading(true);
      try {
        const moviesData = await fetchPopularMovies();
        setMovies(moviesData);
      } catch (err: any) {
        setError(err.message || 'Er is iets misgegaan bij het laden van films');
      } finally {
        setLoading(false);
      }
      return;
    }
    
    setLoading(true);
    try {
      const moviesData = await fetchMoviesByStreaming(service);
      setMovies(moviesData);
    } catch (err: any) {
      setError(err.message || `Er is iets misgegaan bij het filteren op streamingdienst`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-background/80">
      <motion.div 
        className="flex items-center justify-between p-5 shadow-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <FilterBar 
          onSearch={handleSearch}
          onFilterByGenre={handleFilterByGenre}
          onFilterByYear={handleFilterByYear}
          onFilterByFriends={handleFilterByFriends}
          onFilterByStreaming={handleFilterByStreaming}
          genres={genres}
        />
        <motion.button 
          onClick={() => loadMovies(true)}
          className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.5 }}
          aria-label="Vernieuw films"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </motion.button>
      </motion.div>
      
      {isLoading ? (
        <motion.div 
          className="flex-1 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </motion.div>
      ) : error ? (
        <motion.div 
          className="flex-1 flex flex-col items-center justify-center p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-card p-8 rounded-xl shadow-xl text-center max-w-sm">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <h3 className="text-xl font-bold mb-3 text-text">Oeps, er ging iets mis</h3>
            <p className="text-text/70 mb-6">{error}</p>
            <motion.button 
              onClick={() => loadMovies(true)}
              className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Probeer opnieuw
            </motion.button>
          </div>
        </motion.div>
      ) : movies.length - currentIndex <= 0 ? (
        <motion.div 
          className="flex-1 flex flex-col items-center justify-center p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-card p-8 rounded-xl shadow-xl text-center max-w-sm">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </motion.div>
            <h3 className="text-xl font-bold mb-3 text-text">Geen films gevonden</h3>
            <p className="text-text/70 mb-6">Probeer andere filters of laad populaire films.</p>
            <motion.button 
              onClick={() => loadMovies(true)}
              className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Populaire films laden
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="flex-1 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <SwipeStack />
        </motion.div>
      )}
    </div>
  );
};

export default Discover;