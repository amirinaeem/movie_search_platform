/**
 * Profile.jsx
 * View + manage (remove/sort) personal collection.
 */
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import NavBar from '../components/NavBar';
import FilterBar from '../components/FilterBar';
import MovieList from '../components/MovieList';

const API_BASE = import.meta.env.MODE === 'development'
  ? 'http://localhost:5000/api'
  : 'https://movie-search-platform.onrender.com/api';

export default function Profile() {
  const { user, token, logout } = useContext(AuthContext);
  const [collection, setCollection] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/collections`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        const movies = data.movies || [];
        setCollection(movies);
        setFiltered(movies);
      });
  }, [token]);

  function handleFilterChange(field, order) {
    const sorted = [...filtered].sort((a,b) => {
      let av, bv;
      if (field==='title') { av=(a.title||'').toLowerCase(); bv=(b.title||'').toLowerCase(); }
      else if (field==='year') { av=a.year||0; bv=b.year||0; }
      else { av=a.rating||0; bv=b.rating||0; }
      if (av < bv) return order==='asc' ? -1 : 1;
      if (av > bv) return order==='asc' ? 1 : -1;
      return 0;
    });
    setFiltered(sorted);
  }

  async function handleRemove(tmdb_id) {
    await fetch(`${API_BASE}/collections/remove`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
      body: JSON.stringify({ tmdb_id })
    });
    setCollection(prev => prev.filter(m => String(m.tmdb_id) !== String(tmdb_id)));
    setFiltered(prev => prev.filter(m => String(m.tmdb_id) !== String(tmdb_id)));
  }

  if (!user) return <div style={{maxWidth:960,margin:'0 auto',padding:'1.25rem'}}><NavBar/><p>Please sign in first.</p></div>;

  return (
    <div style={{ maxWidth: 960, margin:'0 auto', padding:'1.25rem' }}>
      <NavBar />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h2>{user.name}'s Profile</h2>
        <button onClick={logout}>Logout</button>
      </div>
      <FilterBar onFilterChange={handleFilterChange} />
      <MovieList movies={filtered} onRemoved={handleRemove} />
    </div>
  );
}
