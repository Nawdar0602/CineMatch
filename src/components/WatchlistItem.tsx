import React from 'react';
import { motion } from 'framer-motion';
import { WatchlistItem as WatchlistItemType, WatchStatus } from '../stores/watchlistStore';

type WatchlistItemProps = {
  item: WatchlistItemType;
  onStatusChange: (id: number, status: WatchStatus) => void;
  onRemove: (id: number) => void;
  onPriorityChange: (id: number, priority: number) => void;
  onView: (id: number) => void;
};

const WatchlistItem: React.FC<WatchlistItemProps> = ({
  item,
  onStatusChange,
  onRemove,
  onPriorityChange,
  onView
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  // Status indicator component
  const StatusIndicator = ({ status }: { status: WatchStatus }) => {
    switch (status) {
      case 'unwatched':
        return (
          <span className="flex items-center text-red-500">
            <span className="mr-1">❌</span> Nog niet gezien
          </span>
        );
      case 'watched':
        return (
          <span className="flex items-center text-green-500">
            <span className="mr-1">✅</span> Gezien
          </span>
        );
      case 'planned':
        return (
          <span className="flex items-center text-blue-500">
            <span className="mr-1">📅</span> Samen gepland
            {item.plannedWith && (
              <span className="ml-1 text-xs bg-blue-500 bg-opacity-20 px-2 py-0.5 rounded-full">
                met {item.plannedWith.username}
              </span>
            )}
          </span>
        );
      default:
        return null;
    }
  };
  
  // Priority stars
  const PriorityStars = ({ priority }: { priority: number }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onPriorityChange(item.id, star)}
            className={`text-lg ${star <= priority ? 'text-yellow-400' : 'text-gray-400'}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };
  
  // Streaming services
  const StreamingServices = ({ services }: { services?: string[] }) => {
    if (!services || services.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {services.map((service) => {
          let logo = '🎬';
          let color = 'bg-gray-700';
          
          if (service.includes('Netflix')) {
            logo = 'N';
            color = 'bg-red-600';
          } else if (service.includes('Disney')) {
            logo = 'D+';
            color = 'bg-blue-600';
          } else if (service.includes('HBO')) {
            logo = 'HBO';
            color = 'bg-purple-800';
          } else if (service.includes('Prime')) {
            logo = 'Prime';
            color = 'bg-blue-400';
          } else if (service.includes('Apple')) {
            logo = 'TV+';
            color = 'bg-gray-800';
          }
          
          return (
            <span 
              key={service} 
              className={`${color} text-white text-xs px-2 py-0.5 rounded-sm font-semibold`}
            >
              {logo}
            </span>
          );
        })}
      </div>
    );
  };
  
  // Poster URL
  const posterUrl = item.movie.poster_path
    ? `https://image.tmdb.org/t/p/w200${item.movie.poster_path}`
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
      <div className="flex">
        {/* Poster */}
        <div 
          className="w-20 h-28 flex-shrink-0 bg-cover bg-center cursor-pointer"
          style={{ backgroundImage: `url(${posterUrl})` }}
          onClick={() => onView(item.id)}
        />
        
        {/* Content */}
        <div className="p-3 flex-grow">
          <div className="flex justify-between items-start">
            <h3 
              className="font-bold text-text cursor-pointer"
              onClick={() => onView(item.id)}
            >
              {item.movie.title}
            </h3>
            
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-text opacity-70 p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                {isExpanded ? (
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                )}
              </svg>
            </button>
          </div>
          
          <div className="text-xs text-text opacity-70 mb-1">
            {new Date(item.movie.release_date).getFullYear()} • 
            {item.movie.genres.slice(0, 2).map(g => g.name).join(', ')}
          </div>
          
          <StatusIndicator status={item.status} />
          
          <StreamingServices services={item.streamingServices} />
        </div>
      </div>
      
      {/* Expanded content */}
      {isExpanded && (
        <motion.div 
          className="p-3 border-t border-white border-opacity-10"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex justify-between items-center mb-3">
            <div>
              <div className="text-sm font-semibold mb-1">Prioriteit</div>
              <PriorityStars priority={item.priority} />
            </div>
            
            <div className="text-xs text-text opacity-70">
              Toegevoegd op {new Date(item.addedAt).toLocaleDateString()}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onStatusChange(item.id, 'unwatched')}
              className={`py-1 px-2 rounded text-xs font-medium ${item.status === 'unwatched' ? 'bg-red-500 bg-opacity-30 text-red-300' : 'bg-white bg-opacity-10 text-text'}`}
            >
              Nog niet gezien
            </button>
            
            <button
              onClick={() => onStatusChange(item.id, 'watched')}
              className={`py-1 px-2 rounded text-xs font-medium ${item.status === 'watched' ? 'bg-green-500 bg-opacity-30 text-green-300' : 'bg-white bg-opacity-10 text-text'}`}
            >
              Gezien
            </button>
            
            <button
              onClick={() => onStatusChange(item.id, 'planned')}
              className={`py-1 px-2 rounded text-xs font-medium ${item.status === 'planned' ? 'bg-blue-500 bg-opacity-30 text-blue-300' : 'bg-white bg-opacity-10 text-text'}`}
            >
              Gepland
            </button>
          </div>
          
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => onRemove(item.id)}
              className="text-red-400 text-xs flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Verwijderen
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WatchlistItem;