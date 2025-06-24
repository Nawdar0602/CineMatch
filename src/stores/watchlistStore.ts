import { create } from 'zustand';
import { Movie } from './movieStore';
import { Friend } from './friendStore';

export type WatchStatus = 'unwatched' | 'watched' | 'planned';

export type WatchlistItem = {
  id: number;
  movie: Movie;
  status: WatchStatus;
  priority: number;
  addedAt: string;
  plannedWith?: Friend;
  streamingServices?: string[];
};

type WatchlistState = {
  items: WatchlistItem[];
  isLoading: boolean;
  error: string | null;
  setItems: (items: WatchlistItem[]) => void;
  addItem: (item: WatchlistItem) => void;
  removeItem: (itemId: number) => void;
  updateItemStatus: (itemId: number, status: WatchStatus, plannedWith?: Friend) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useWatchlistStore = create<WatchlistState>((set) => ({
  items: [],
  isLoading: false,
  error: null,
  
  setItems: (items) => set({ items }),
  
  addItem: (item) => set((state) => {
    // Check if movie already exists in watchlist
    const exists = state.items.some(i => i.movie.id === item.movie.id);
    if (exists) return state;
    
    return { items: [...state.items, item] };
  }),
  
  removeItem: (itemId) => set((state) => ({
    items: state.items.filter(item => item.id !== itemId),
  })),
  
  updateItemStatus: (itemId, status, plannedWith) => set((state) => ({
    items: state.items.map(item => 
      item.id === itemId 
        ? { ...item, status, plannedWith: plannedWith || item.plannedWith }
        : item
    ),
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));