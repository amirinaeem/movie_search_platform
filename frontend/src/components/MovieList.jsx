/**
 * MovieList.jsx
 * Responsive grid of MovieCard(s). Supports optional onRemoved for Profile page.
 */
import React from 'react';
import MovieCard from './MovieCard.jsx';

export default function MovieList({ movies, onRemoved }) {
  if (!movies || movies.length === 0) {
    return <p style={{ textAlign:'center', marginTop:'2rem', color:'#666' }}>No movies found. Try another search 🎬</p>;
  }
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'1.25rem', marginTop:'1rem' }}>
      {movies.map(m => (
        <MovieCard key={m.tmdb_id || m._id || m.title} movie={m} onRemoved={onRemoved} />
      ))}
    </div>
  );
}
