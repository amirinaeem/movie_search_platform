import React, { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar.jsx';
import MovieList from './components/MovieList.jsx';
import AddUserForm from './components/AddUserForm.jsx';

// 🔗 Direct backend API URL
const API_BASE = "https://movie-search-backend.onrender.com/api";

const bannerStyle = {
  background: '#e8f5e9',
  border: '1px solid #a5d6a7',
  color: '#1b5e20',
  padding: '0.6rem 0.9rem',
  borderRadius: '6px',
  marginBottom: '1rem'
};

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [banner, setBanner] = useState('');

  // Load initial 20 movies
  useEffect(() => {
    loadInitial();
  }, []);

  async function loadInitial() {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_BASE}/movies?limit=20&sort=year&order=desc`);
      if (!res.ok) throw new Error('Failed to load movies');
      const data = await res.json(); // { items, total, page, limit }
      setMovies(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Search by title
  async function handleSearch(query) {
    setBanner('');
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/movies/search?title=${encodeURIComponent(query)}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Search failed');
      }
      const data = await res.json(); // array
      setMovies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // After user added
  async function handleUserAdded() {
    setBanner('User added successfully!');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await loadInitial();
    setTimeout(() => setBanner(''), 3500);
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '1.25rem', fontFamily: 'Inter, Arial, sans-serif' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem' }}>🎬 Movie Search Platform</h1>
        <small style={{ opacity: 0.7 }}>sample_mflix</small>
      </header>

      {banner && <div style={bannerStyle}>{banner}</div>}

      <section style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
        <SearchBar onSearch={handleSearch} />
        {loading && <p>Loading…</p>}
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <MovieList movies={movies} />
      </section>

      <section style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: '1rem' }}>
        <AddUserForm onSuccess={handleUserAdded} />
      </section>

      <footer style={{ textAlign: 'center', opacity: 0.6, marginTop: '1rem' }}>
        <small>Powered by MongoDB Atlas sample_mflix</small>
      </footer>
    </div>
  );
}
