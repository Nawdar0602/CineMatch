import { create } from 'zustand';
import { Movie } from './movieStore';

export interface Friend {
  id: string;
  username: string;
  profilePicture: string;
  compatibilityScore?: number;
}

export interface PendingRequest extends Friend {}

export interface SentRequest extends Friend {}

export interface Match {
  id: string;
  movieId: number;
  friendId: string;
  createdAt: string;
  friend: Friend;
  movie: Movie;
}

interface FriendStore {
  friends: Friend[];
  pendingRequests: PendingRequest[];
  sentRequests: SentRequest[];
  matches: Match[];
  loading: boolean;
  error: string | null;
  setFriends: (friends: Friend[]) => void;
  setPendingRequests: (requests: PendingRequest[]) => void;
  setSentRequests: (requests: SentRequest[]) => void;
  setMatches: (matches: Match[]) => void;
  addFriend: (friend: Friend) => void;
  removeFriend: (friendId: string) => void;
  addMatch: (match: Match) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useFriendStore = create<FriendStore>((set) => ({
  friends: [],
  pendingRequests: [],
  sentRequests: [],
  matches: [],
  loading: false,
  error: null,
  
  setFriends: (friends) => set({ friends }),
  setPendingRequests: (requests) => set({ pendingRequests: requests }),
  setSentRequests: (requests) => set({ sentRequests: requests }),
  setMatches: (matches) => set({ matches }),
  
  addFriend: (friend) => set((state) => ({
    friends: [...state.friends, friend],
    pendingRequests: state.pendingRequests.filter(req => req.id !== friend.id),
  })),
  
  removeFriend: (friendId) => set((state) => ({
    friends: state.friends.filter(friend => friend.id !== friendId),
  })),
  
  addMatch: (match) => set((state) => ({
    matches: [match, ...state.matches],
  })),
  
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));