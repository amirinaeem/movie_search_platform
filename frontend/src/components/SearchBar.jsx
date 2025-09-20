/**
 * SearchBar.jsx
 * Simple submit -> parent handles fetch + state.
 */
import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query);
  };
  return (
    <form onSubmit={handleSubmit} style={{ display:'flex', gap:'0.5rem', marginBottom:'1rem' }}>
      <input
        value={query}
        onChange={(e)=>setQuery(e.target.value)}
        placeholder="Search by movie title..."
        style={{ flex:1, padding:'0.5rem', border:'1px solid #ccc', borderRadius:4 }}
      />
      <button style={{ padding:'0.5rem 1rem' }}>Search</button>
    </form>
  );
}
