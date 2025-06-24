import { create } from 'zustand';

export type Movie = {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genres: { id: number; name: string }[];
};

type MovieAction = 'like' | 'dislike' | 'superlike';

type MovieState = {
  movies: Movie[];
  likedMovies: Movie[];
  dislikedMovies: Movie[];
  superLikedMovies: Movie[];
  currentIndex: number;
  isLoading: boolean;
  error: string | null;
  setMovies: (movies: Movie[]) => void;
  handleSwipe: (direction: MovieAction) => void;
  resetMovies: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useMovieStore = create<MovieState>()((set) => ({
  movies: [],
  likedMovies: [],
  dislikedMovies: [],
  superLikedMovies: [],
  currentIndex: 0,
  isLoading: false,
  error: null,
  
  setMovies: (movies) => set({ movies, currentIndex: 0, isLoading: false, error: null }),
  
  handleSwipe: (direction) => 
    set((state) => {
      if (state.currentIndex >= state.movies.length) {
        return state; // No more movies to swipe
      }
      
      const currentMovie = state.movies[state.currentIndex];
      
      switch (direction) {
        case 'like':
          return {
            likedMovies: [...state.likedMovies, currentMovie],
            currentIndex: state.currentIndex + 1,
          };
        case 'dislike':
          return {
            dislikedMovies: [...state.dislikedMovies, currentMovie],
            currentIndex: state.currentIndex + 1,
          };
        case 'superlike':
          return {
            superLikedMovies: [...state.superLikedMovies, currentMovie],
            currentIndex: state.currentIndex + 1,
          };
        default:
          return state;
      }
    }),
  
  resetMovies: () => set({ 
    movies: [], 
    likedMovies: [], 
    dislikedMovies: [], 
    superLikedMovies: [], 
    currentIndex: 0 
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));