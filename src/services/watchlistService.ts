import { WatchlistItem, WatchStatus } from '../stores/watchlistStore';
import { Movie } from '../stores/movieStore';
import { Friend } from '../stores/friendStore';

// In een echte app zou deze data uit de database komen
// Bijvoorbeeld:
// const getMoviesFromDatabase = async () => {
//   const connection = await getConnection();
//   const [rows] = await connection.execute(
//     'SELECT * FROM movies ORDER BY release_date DESC LIMIT 10'
//   );
//   return rows;
// };

// Lege arrays voor data (in een echte app zou deze data uit de database komen)
const MOCK_FRIENDS: Friend[] = [];

const MOCK_WATCHLIST: WatchlistItem[] = [];

// Simuleer een API call met een timeout
const simulateApiCall = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Watchlist services
export const getWatchlist = async (): Promise<WatchlistItem[]> => {
  try {
    return simulateApiCall(MOCK_WATCHLIST);
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    throw error;
  }
};

export const addToWatchlist = async (movie: Movie): Promise<WatchlistItem> => {
  try {
    // Controleer of film al in watchlist staat
    if (MOCK_WATCHLIST.some(item => item.movie.id === movie.id)) {
      throw new Error('Film staat al in je watchlist');
    }
    
    // Maak nieuw watchlist item
    const newItem: WatchlistItem = {
      id: MOCK_WATCHLIST.length + 1,
      movie,
      status: 'unwatched',
      priority: 2, // Standaard prioriteit
      addedAt: new Date().toISOString(),
      streamingServices: [] // Standaard geen streamingdiensten
    };
    
    // Voeg toe aan watchlist
    MOCK_WATCHLIST.push(newItem);
    
    return simulateApiCall(newItem);
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    throw error;
  }
};

export const removeFromWatchlist = async (itemId: number): Promise<{ success: boolean }> => {
  try {
    // Zoek index van item
    const index = MOCK_WATCHLIST.findIndex(item => item.id === itemId);
    
    if (index === -1) {
      throw new Error('Item niet gevonden in watchlist');
    }
    
    // Verwijder item
    MOCK_WATCHLIST.splice(index, 1);
    
    return simulateApiCall({ success: true });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    throw error;
  }
};

export const updateWatchlistItemStatus = async (
  itemId: number, 
  status: WatchStatus, 
  plannedWith?: Friend
): Promise<WatchlistItem> => {
  try {
    // Zoek item
    const index = MOCK_WATCHLIST.findIndex(item => item.id === itemId);
    
    if (index === -1) {
      throw new Error('Item niet gevonden in watchlist');
    }
    
    // Update status
    MOCK_WATCHLIST[index] = {
      ...MOCK_WATCHLIST[index],
      status,
      plannedWith: status === 'planned' ? plannedWith : undefined
    };
    
    return simulateApiCall(MOCK_WATCHLIST[index]);
  } catch (error) {
    console.error('Error updating watchlist item status:', error);
    throw error;
  }
};

export const updateWatchlistItemPriority = async (
  itemId: number, 
  priority: number
): Promise<WatchlistItem> => {
  try {
    // Zoek item
    const index = MOCK_WATCHLIST.findIndex(item => item.id === itemId);
    
    if (index === -1) {
      throw new Error('Item niet gevonden in watchlist');
    }
    
    // Update prioriteit
    MOCK_WATCHLIST[index] = {
      ...MOCK_WATCHLIST[index],
      priority
    };
    
    return simulateApiCall(MOCK_WATCHLIST[index]);
  } catch (error) {
    console.error('Error updating watchlist item priority:', error);
    throw error;
  }
};

export const getStreamingServices = async (movieId: number): Promise<string[]> => {
  try {
    // In een echte app zou dit een API call zijn naar een streaming service database
    // Hier simuleren we het met willekeurige services
    const services = ['Netflix', 'Disney+', 'HBO Max', 'Amazon Prime', 'Apple TV+'];
    const randomServices = [];
    const numServices = Math.floor(Math.random() * 3); // 0-2 services
    
    for (let i = 0; i < numServices; i++) {
      const randomIndex = Math.floor(Math.random() * services.length);
      randomServices.push(services[randomIndex]);
    }
    
    return simulateApiCall([...new Set(randomServices)]); // Verwijder duplicaten
  } catch (error) {
    console.error('Error getting streaming services:', error);
    throw error;
  }
};