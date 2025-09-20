import React, { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar.jsx';
import MovieList from './components/MovieList.jsx';
import FilterBar from './components/FilterBar.jsx';

const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://movie-search-platform.onrender.com/api";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadInitial();
  }, []);

  async function loadInitial() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/movies?limit=20&sort=year&order=desc`);
      const data = await res.json();
      setMovies(data.items || []);
      setFilteredMovies(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(query) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/tmdb/search?title=${encodeURIComponent(query)}`);
      const data = await res.json();
      setMovies(data);
      setFilteredMovies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(field, order) {
    const sorted = [...movies].sort((a, b) => {
      let aVal, bVal;

      if (field === 'title') {
        aVal = a.title?.toLowerCase() || '';
        bVal = b.title?.toLowerCase() || '';
      } else if (field === 'year') {
        aVal = a.year || 0;
        bVal = b.year || 0;
      } else if (field === 'rating') {
        aVal = a.imdb?.rating || 0;
        bVal = b.imdb?.rating || 0;
      }

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredMovies(sorted);
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '1.25rem' }}>
      <h1>🎬 Movie Search Platform</h1>
      <SearchBar onSearch={handleSearch} />
      <FilterBar onFilterChange={handleFilterChange} />
      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <MovieList movies={filteredMovies} />
    </div>
  );
}
