const API_BASE = 'https://api.themoviedb.org/3';
const API_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;

const fetchOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_TOKEN}`,
  },
};

export { API_BASE, API_TOKEN, fetchOptions };