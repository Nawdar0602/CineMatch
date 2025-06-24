import axios from 'axios';
import { Movie } from '../stores/movieStore';

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  }
});

// Houd bij welke pagina we laatst hebben opgevraagd
let currentPage = 1;
let totalPages = 1;

export const fetchPopularMovies = async (resetPage: boolean = false): Promise<Movie[]> => {
  try {
    // Reset de pagina als dat wordt gevraagd
    if (resetPage) {
      currentPage = 1;
    } else {
      // Anders verhoog de pagina voor nieuwe resultaten
      // Zorg ervoor dat we binnen het bereik van beschikbare pagina's blijven
      currentPage = currentPage >= totalPages ? 1 : currentPage + 1;
    }
    
    const response = await api.get(`/movie/popular?page=${currentPage}`);
    totalPages = response.data.total_pages;
    
    // Haal de genres op voor elke film
    const genresResponse = await api.get('/genre/movie/list');
    const genresMap = new Map(genresResponse.data.genres.map((genre: any) => [genre.id, genre]));
    
    return response.data.results.map((movie: any) => ({
      ...movie,
      genres: movie.genre_ids?.map((id: number) => genresMap.get(id) || { id, name: 'Onbekend' }) || []
    }));
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const fetchMovieDetails = async (movieId: number): Promise<Movie> => {
  try {
    const response = await api.get(`/movie/${movieId}?append_to_response=credits,videos`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId}:`, error);
    throw error;
  }
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await api.get(`/search/movie?query=${encodeURIComponent(query)}`);
    
    // Haal de genres op voor elke film
    const genresResponse = await api.get('/genre/movie/list');
    const genresMap = new Map(genresResponse.data.genres.map((genre: any) => [genre.id, genre]));
    
    return response.data.results.map((movie: any) => ({
      ...movie,
      genres: movie.genre_ids?.map((id: number) => genresMap.get(id) || { id, name: 'Onbekend' }) || []
    }));
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const fetchMoviesByGenre = async (genreId: number): Promise<Movie[]> => {
  try {
    const response = await api.get(`/discover/movie?with_genres=${genreId}`);
    
    // Haal de genres op voor elke film
    const genresResponse = await api.get('/genre/movie/list');
    const genresMap = new Map(genresResponse.data.genres.map((genre: any) => [genre.id, genre]));
    
    return response.data.results.map((movie: any) => ({
      ...movie,
      genres: movie.genre_ids?.map((id: number) => genresMap.get(id) || { id, name: 'Onbekend' }) || []
    }));
  } catch (error) {
    console.error(`Error fetching movies for genre ${genreId}:`, error);
    throw error;
  }
};

export const fetchGenres = async () => {
  try {
    const response = await api.get('/genre/movie/list');
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

export const fetchMoviesByYear = async (year: number): Promise<Movie[]> => {
  try {
    // Maak een datumbereik voor het hele jaar
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    
    const response = await api.get(`/discover/movie?primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}&sort_by=popularity.desc`);
    
    // Haal de genres op voor elke film
    const genresResponse = await api.get('/genre/movie/list');
    const genresMap = new Map(genresResponse.data.genres.map((genre: any) => [genre.id, genre]));
    
    return response.data.results.map((movie: any) => ({
      ...movie,
      genres: movie.genre_ids?.map((id: number) => genresMap.get(id) || { id, name: 'Onbekend' }) || []
    }));
  } catch (error) {
    console.error(`Error fetching movies for year ${year}:`, error);
    throw error;
  }
};

export const fetchMoviesByStreaming = async (providerId: string): Promise<Movie[]> => {
  try {
    // De TMDb API ondersteunt filteren op streamingdienst via de watch/providers parameter
    // Hier gebruiken we de provider_id parameter om te filteren op een specifieke streamingdienst
    const response = await api.get(`/discover/movie?with_watch_providers=${providerId}&watch_region=NL`);
    
    // Haal de genres op voor elke film
    const genresResponse = await api.get('/genre/movie/list');
    const genresMap = new Map(genresResponse.data.genres.map((genre: any) => [genre.id, genre]));
    
    return response.data.results.map((movie: any) => ({
      ...movie,
      genres: movie.genre_ids?.map((id: number) => genresMap.get(id) || { id, name: 'Onbekend' }) || []
    }));
  } catch (error) {
    console.error(`Error fetching movies for streaming provider ${providerId}:`, error);
    throw error;
  }
};

// Functie om de beschikbare streamingdiensten op te halen
export const fetchStreamingProviders = async (): Promise<any[]> => {
  try {
    const response = await api.get('/watch/providers/movie?watch_region=NL');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching streaming providers:', error);
    throw error;
  }
};

export default api;