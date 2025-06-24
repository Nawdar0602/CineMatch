import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WatchlistItem from '../components/WatchlistItem';
import { useWatchlistStore, WatchlistItem as WatchlistItemType, WatchStatus } from '../stores/watchlistStore';
import { getWatchlist, removeFromWatchlist, updateWatchlistItemStatus, updateWatchlistItemPriority } from '../services/watchlistService';

const Watchlist: React.FC = () => {
  const { items: watchlist, setItems: setWatchlist, isLoading, setLoading, error, setError, updateItemStatus, removeItem } = useWatchlistStore();
  const [filter, setFilter] = useState<'all' | 'unwatched' | 'watched' | 'planned'>('all');
  
  useEffect(() => {
    const loadWatchlist = async () => {
      setLoading(true);
      try {
        const watchlistData = await getWatchlist();
        setWatchlist(watchlistData);
      } catch (err: any) {
        setError(err.message || 'Er is iets misgegaan bij het laden van je watchlist');
      } finally {
        setLoading(false);
      }
    };
    
    loadWatchlist();
  }, [setWatchlist, setLoading, setError]);
  
  const filteredWatchlist = watchlist.filter((item: WatchlistItemType) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });
  
  // Sorteer op prioriteit (hoog naar laag)
  const sortedWatchlist = [...filteredWatchlist].sort((a, b) => b.priority - a.priority);

  // Handlers voor WatchlistItem acties
  const handleStatusChange = async (itemId: number, status: WatchStatus) => {
    try {
      setLoading(true);
      const updatedItem = await updateWatchlistItemStatus(itemId, status);
      updateItemStatus(itemId, status);
    } catch (err: any) {
      setError(err.message || 'Er is iets misgegaan bij het bijwerken van de status');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId: number) => {
    try {
      setLoading(true);
      await removeFromWatchlist(itemId);
      removeItem(itemId);
    } catch (err: any) {
      setError(err.message || 'Er is iets misgegaan bij het verwijderen van het item');
    } finally {
      setLoading(false);
    }
  };

  const handlePriorityChange = async (itemId: number, priority: number) => {
    try {
      setLoading(true);
      await updateWatchlistItemPriority(itemId, priority);
      // Update lokale state
      setWatchlist(watchlist.map(item => 
        item.id === itemId ? { ...item, priority } : item
      ));
    } catch (err: any) {
      setError(err.message || 'Er is iets misgegaan bij het bijwerken van de prioriteit');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (itemId: number) => {
    // Navigeer naar de detailpagina van de film
    const item = watchlist.find(item => item.id === itemId);
    if (item) {
      window.location.href = `/movie/${item.movie.id}`;
    }
  };
  
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text mb-4">Mijn Watchlist</h1>
        
        {/* Filter tabs */}
        <div className="flex overflow-x-auto space-x-2 pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${filter === 'all' ? 'bg-accent text-white' : 'bg-white bg-opacity-10 text-text'}`}
          >
            Alle films
          </button>
          <button
            onClick={() => setFilter('unwatched')}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${filter === 'unwatched' ? 'bg-accent text-white' : 'bg-white bg-opacity-10 text-text'}`}
          >
            Nog niet gezien
          </button>
          <button
            onClick={() => setFilter('watched')}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${filter === 'watched' ? 'bg-accent text-white' : 'bg-white bg-opacity-10 text-text'}`}
          >
            Gezien
          </button>
          <button
            onClick={() => setFilter('planned')}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${filter === 'planned' ? 'bg-accent text-white' : 'bg-white bg-opacity-10 text-text'}`}
          >
            Samen gepland
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-text">Watchlist laden...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500 bg-opacity-20 text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : sortedWatchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text opacity-50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-xl font-bold text-text mb-2">Je watchlist is leeg</h3>
          <p className="text-text opacity-70 mb-4">Swipe naar rechts op films die je wilt bekijken</p>
          <button 
            onClick={() => window.location.href = '/discover'}
            className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all"
          >
            Films ontdekken
          </button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="space-y-4"
        >
          {sortedWatchlist.map((item) => (
            <WatchlistItem 
              key={item.id} 
              item={item} 
              onStatusChange={handleStatusChange}
              onRemove={handleRemove}
              onPriorityChange={handlePriorityChange}
              onView={handleView}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Watchlist;