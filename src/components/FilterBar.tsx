import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterBarProps {
  onSearch: (query: string) => void;
  onFilterByGenre: (genreId: number | null) => void;
  onFilterByYear: (year: number | null) => void;
  onFilterByFriends: (friendsOnly: boolean) => void;
  onFilterByStreaming: (service: string | null) => void;
  genres: { id: number; name: string }[];
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  onSearch, 
  onFilterByGenre, 
  onFilterByYear,
  onFilterByFriends,
  onFilterByStreaming,
  genres 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [friendsOnly, setFriendsOnly] = useState(false);
  const [selectedStreaming, setSelectedStreaming] = useState<string | null>(null);
  const [streamingServices] = useState<{ id: string; name: string; logo: string }[]>([
    { id: '8', name: 'Netflix', logo: '🔴' },
    { id: '337', name: 'Disney+', logo: '🔵' },
    { id: '384', name: 'HBO Max', logo: '⚫' },
    { id: '119', name: 'Amazon Prime', logo: '🔶' },
    { id: '350', name: 'Apple TV+', logo: '⚪' },
    { id: '77', name: 'Videoland', logo: '🟠' },
  ]);
  
  // Laad streamingdiensten bij het laden van de component
  useEffect(() => {
    const loadStreamingProviders = async () => {
      try {
        // Hier zou je fetchStreamingProviders kunnen aanroepen om de echte providers te laden
        // Voor nu gebruiken we de hardcoded lijst omdat de UI al is opgezet voor deze providers
        // const providers = await fetchStreamingProviders();
        // setStreamingServices(providers.map(p => ({ id: p.provider_id, name: p.provider_name, logo: p.logo_path })));
      } catch (error) {
        console.error('Fout bij het laden van streamingdiensten:', error);
      }
    };
    
    loadStreamingProviders();
  }, []);
  
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setIsOpen(false);
  };

  const handleGenreSelect = (genreId: number | null) => {
    setSelectedGenre(genreId);
    onFilterByGenre(genreId);
    setIsOpen(false);
  };

  const handleYearSelect = (year: number | null) => {
    setSelectedYear(year);
    onFilterByYear(year);
    setIsOpen(false);
  };

  const handleFriendsToggle = () => {
    setFriendsOnly(!friendsOnly);
    onFilterByFriends(!friendsOnly);
  };

  const handleStreamingSelect = (service: string | null) => {
    setSelectedStreaming(service);
    onFilterByStreaming(service);
    setIsOpen(false);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    // Sorteer lokaal, geen callback nodig
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Filter toggle button - lager gepositioneerd */}
      <motion.button
        className="fixed top-16 left-4 z-30 bg-accent text-white p-3 rounded-full shadow-lg"
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        )}
      </motion.button>
      
      {/* Filter panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay to prevent clicks on background */}
            <motion.div 
              className="fixed inset-0 bg-black/50 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              className="fixed top-[12vh] left-4 right-4 md:left-4 md:right-4 bg-gray-900 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-5 z-40 w-[90%] mx-auto max-w-4xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
            {/* Search */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-text flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Zoeken
              </h3>
              <form onSubmit={handleSearch} className="flex">
                <motion.input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Titel, acteur of regisseur..."
                  className="flex-grow bg-background rounded-l-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary border border-white/5 transition-all duration-300"
                  initial={{ scale: 0.98 }}
                  whileFocus={{ scale: 1 }}
                />
                <motion.button
                  type="submit"
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 rounded-r-lg shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </motion.button>
              </form>
            </div>
            
            {/* Genres */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-text flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Genre
              </h3>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  onClick={() => handleGenreSelect(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedGenre === null ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md' : 'bg-background text-text hover:bg-white/10'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Alle genres
                </motion.button>
                {genres.map((genre) => (
                  <motion.button
                    key={genre.id}
                    onClick={() => handleGenreSelect(selectedGenre === genre.id ? null : genre.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedGenre === genre.id ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md' : 'bg-background text-text hover:bg-white/10'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {genre.name}
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Release jaar */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-text flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Releasejaar
              </h3>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  onClick={() => handleYearSelect(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedYear === null ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md' : 'bg-background text-text hover:bg-white/10'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Alle jaren
                </motion.button>
                {years.slice(0, 8).map((year) => (
                  <motion.button
                    key={year}
                    onClick={() => handleYearSelect(selectedYear === year ? null : year)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedYear === year ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md' : 'bg-background text-text hover:bg-white/10'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {year}
                  </motion.button>
                ))}
                <motion.select
                  value={selectedYear || ''}
                  onChange={(e) => handleYearSelect(e.target.value ? parseInt(e.target.value) : null)}
                  className="bg-background text-text rounded-full text-sm px-4 py-2 border border-white/5 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <option value="">Meer jaren...</option>
                  {years.slice(8).map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </motion.select>
              </div>
            </div>
            
            {/* Vrienden filter */}
            <div className="mb-6">
              <div className="flex items-center bg-background p-3 rounded-lg border border-white/5">
                <motion.input
                  type="checkbox"
                  id="friendsOnly"
                  checked={friendsOnly}
                  onChange={handleFriendsToggle}
                  className="h-5 w-5 text-primary rounded focus:ring-primary"
                  whileHover={{ scale: 1.1 }}
                />
                <label htmlFor="friendsOnly" className="ml-3 text-text font-medium">
                  Alleen films van vrienden
                </label>
              </div>
            </div>
            
            {/* Streaming services */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-text flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Beschikbaar op
              </h3>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  onClick={() => handleStreamingSelect(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedStreaming === null ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md' : 'bg-background text-text hover:bg-white/10'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Alle diensten
                </motion.button>
                {streamingServices.map((service) => (
                  <motion.button
                    key={service.id}
                    onClick={() => handleStreamingSelect(selectedStreaming === service.id ? null : service.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${selectedStreaming === service.id ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md' : 'bg-background text-text hover:bg-white/10'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="mr-2 text-lg">{service.logo}</span>
                    {service.name}
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Sorteren */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-text flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                </svg>
                Sorteren op
              </h3>
              <div className="space-y-2">
                <motion.div 
                  className={`px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${sortBy === 'popularity.desc' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md' : 'bg-background text-text hover:bg-white/10'}`}
                  onClick={() => handleSortChange('popularity.desc')}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center">
                    <span className="flex-1 font-medium">Populariteit</span>
                    {sortBy === 'popularity.desc' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </motion.div>
                <motion.div 
                  className={`px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${sortBy === 'vote_average.desc' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md' : 'bg-background text-text hover:bg-white/10'}`}
                  onClick={() => handleSortChange('vote_average.desc')}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center">
                    <span className="flex-1 font-medium">Beoordeling</span>
                    {sortBy === 'vote_average.desc' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </motion.div>
                <motion.div 
                  className={`px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${sortBy === 'release_date.desc' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md' : 'bg-background text-text hover:bg-white/10'}`}
                  onClick={() => handleSortChange('release_date.desc')}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center">
                    <span className="flex-1 font-medium">Nieuwste</span>
                    {sortBy === 'release_date.desc' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Close button */}
            <motion.button
              onClick={() => setIsOpen(false)}
              className="w-full py-3 bg-background rounded-lg text-text hover:bg-white/10 transition-all duration-300 font-medium shadow-md"
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ y: 0, scale: 0.99 }}
            >
              Sluiten
            </motion.button>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;