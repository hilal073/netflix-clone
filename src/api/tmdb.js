import axios from 'axios';
import { MOCK_MOVIES, MOCK_CATEGORIES } from './mockData';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
const BASE_URL = 'https://api.themoviedb.org/3';

export const tmdbAxios = axios.create({
  baseURL: BASE_URL,
});

export const requests = {
  // General / Home
  fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
  fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
  fetchTopRated: `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
  fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
  fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&with_genres=27`,
  fetchDocumentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,

  // TV Shows Specific
  fetchPopularTV: `/tv/popular?api_key=${API_KEY}&language=en-US`,
  fetchTopRatedTV: `/tv/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchOnTheAirTV: `/tv/on_the_air?api_key=${API_KEY}&language=en-US`,
  fetchDramaTV: `/discover/tv?api_key=${API_KEY}&with_genres=18`,
  fetchSciFiTV: `/discover/tv?api_key=${API_KEY}&with_genres=10765`,
  fetchAnimationTV: `/discover/tv?api_key=${API_KEY}&with_genres=16`,

  // Movies Specific
  fetchPopularMovies: `/movie/popular?api_key=${API_KEY}&language=en-US`,
  fetchNowPlayingMovies: `/movie/now_playing?api_key=${API_KEY}&language=en-US`,
  fetchTopRatedMovies: `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchSciFiMovies: `/discover/movie?api_key=${API_KEY}&with_genres=878`,

  // New & Popular Specific
  fetchTrendingToday: `/trending/all/day?api_key=${API_KEY}&language=en-US`,
  fetchUpcoming: `/movie/upcoming?api_key=${API_KEY}&language=en-US`,

  search: (query) => `/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}`,
  fetchVideos: (id, type = 'movie') => `/${type}/${id}/videos?api_key=${API_KEY}`,
};

export const TMDB_IMAGE_BASE = {
  backdrop: 'https://image.tmdb.org/t/p/original',
  poster: 'https://image.tmdb.org/t/p/w500',
};

export const getImageUrl = (path, type = 'backdrop') => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE[type]}${path}`;
};

// Safe fetch helper: falls back to mock category or empty list if no API key or network error
export const fetchCategoryMovies = async (fetchUrl, categoryId) => {
  if (!API_KEY) {
    const found = MOCK_CATEGORIES.find((cat) => cat.id === categoryId);
    return found ? found.movies : MOCK_MOVIES;
  }
  try {
    const response = await tmdbAxios.get(fetchUrl);
    return response.data.results || [];
  } catch (err) {
    console.warn(`TMDB fetch failed for ${fetchUrl}, falling back to mock data:`, err.message);
    const found = MOCK_CATEGORIES.find((cat) => cat.id === categoryId);
    return found ? found.movies : MOCK_MOVIES;
  }
};
