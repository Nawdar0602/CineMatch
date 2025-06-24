import React from 'react';
import { motion } from 'framer-motion';
import { Match } from '../stores/friendStore';

type MatchCardProps = {
  match: Match;
  onViewMovie: (movieId: number) => void;
  onViewFriend: (friendId: string) => void;
  onAddToWatchlist: (movieId: number) => void;
  onChat: (friendId: string) => void;
};

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onViewMovie,
  onViewFriend,
  onAddToWatchlist,
  onChat
}) => {
  // Bereken hoe lang geleden de match was
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
      return `${diffDay} ${diffDay === 1 ? 'dag' : 'dagen'} geleden`;
    }
    if (diffHour > 0) {
      return `${diffHour} ${diffHour === 1 ? 'uur' : 'uur'} geleden`;
    }
    if (diffMin > 0) {
      return `${diffMin} ${diffMin === 1 ? 'minuut' : 'minuten'} geleden`;
    }
    return 'Zojuist';
  };
  
  // Poster URL
  const posterUrl = match.movie.poster_path
    ? `https://image.tmdb.org/t/p/w200${match.movie.poster_path}`
    : 'https://via.placeholder.com/200x300?text=Geen+poster';
  
  return (
    <motion.div 
      className="bg-white bg-opacity-5 rounded-lg overflow-hidden shadow-md"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <img 
              src={match.friend.profilePicture || 'https://via.placeholder.com/40?text=?'} 
              alt={match.friend.username} 
              className="w-8 h-8 rounded-full border border-accent cursor-pointer"
              onClick={() => onViewFriend(match.friend.id)}
            />
            <div className="ml-2">
              <span 
                className="font-medium text-text cursor-pointer hover:text-accent transition-colors"
                onClick={() => onViewFriend(match.friend.id)}
              >
                {match.friend.username}
              </span>
              <div className="text-xs text-text opacity-70">
                {getTimeAgo(match.createdAt)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div className="flex">
          <div 
            className="w-20 h-28 flex-shrink-0 bg-cover bg-center rounded cursor-pointer"
            style={{ backgroundImage: `url(${posterUrl})` }}
            onClick={() => onViewMovie(match.movie.id)}
          />
          
          <div className="ml-3">
            <h3 
              className="font-bold text-text cursor-pointer hover:text-accent transition-colors"
              onClick={() => onViewMovie(match.movie.id)}
            >
              {match.movie.title}
            </h3>
            
            <div className="text-xs text-text opacity-70 mb-2">
              {new Date(match.movie.release_date).getFullYear()} • 
              {match.movie.genres.slice(0, 2).map(g => g.name).join(', ')}
            </div>
            
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => onChat(match.friend.id)}
                className="text-xs bg-accent text-white px-2 py-1 rounded flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                Chat
              </button>
              
              <button
                onClick={() => onAddToWatchlist(match.movie.id)}
                className="text-xs bg-transparent border border-accent text-accent px-2 py-1 rounded flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchCard;