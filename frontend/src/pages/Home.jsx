/**
 * Home.jsx
 * Homepage: initial 20 from DB, TMDB live search, client-side sorting.
 */
import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import MovieList from '../components/MovieList';

const API_BASE = import.meta.env.MODE === 'development'
  ? 'http://localhost:5000/api'
  : 'https://movie-search-platform.onrender.com/api';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(()=>{ loadInitial(); }, []);

  async function loadInitial() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/movies?limit=20&sort=year&order=desc`);
      if (!res.ok) throw new Error('Failed to load movies');
      const data = await res.json();
      setMovies(data.items || []);
      setFiltered(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(query) {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_BASE}/tmdb/search?title=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setMovies(data);
      setFiltered(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(field, order) {
    const sorted = [...movies].sort((a,b) => {
      const safe = (v) => (v==null ? '' : v);
      let av, bv;
      if (field === 'title') {
        av = (a.title || '').toLowerCase(); bv = (b.title || '').toLowerCase();
      } else if (field === 'year') {
        av = a.year || 0; bv = b.year || 0;
      } else {
        av = a.imdb?.rating || 0; bv = b.imdb?.rating || 0;
      }
      if (av < bv) return order === 'asc' ? -1 : 1;
      if (av > bv) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setFiltered(sorted);
  }

  return (
    <div style={{ maxWidth: 960, margin:'0 auto', padding:'1.25rem' }}>
      <NavBar />
      <h1>🎬 Movie Search Platform</h1>
      <SearchBar onSearch={handleSearch} />
      <FilterBar onFilterChange={handleFilterChange} />
      {loading && <p>Loading…</p>}
      {error && <p style={{ color:'crimson' }}>{error}</p>}
      <MovieList movies={filtered} />
    </div>
  );
}
