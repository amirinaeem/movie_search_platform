/**
 * MovieCard.jsx
 * Poster + details, add-to-collection (if signed in).
 */
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const API_BASE = import.meta.env.MODE === 'development'
  ? 'http://localhost:5000/api'
  : 'https://movie-search-platform.onrender.com/api';

export default function MovieCard({ movie, onRemoved }) {
  const { token } = useContext(AuthContext);

  const posterUrl =
    movie.poster && movie.poster !== 'null'
      ? movie.poster
      : movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : '/noposter.jpg';

  const rating =
    movie.vote_average != null
      ? Number(movie.vote_average).toFixed(1)
      : movie.imdb?.rating != null
      ? Number(movie.imdb.rating).toFixed(1)
      : null;

  const release = movie.release_date || (movie.year ? String(movie.year) : '');

  async function addToCollection() {
    if (!token) return alert('Please sign in first');
    const payload = {
      movie: {
        tmdb_id: String(movie.tmdb_id ?? movie.id ?? ''),
        title: movie.title,
        year: movie.year ?? (movie.release_date ? Number(movie.release_date.split('-')[0]) : null),
        poster: posterUrl,
        overview: movie.overview || '',
        rating: rating ? Number(rating) : 0,
      }
    };
    const res = await fetch(`${API_BASE}/collections/add`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return alert('Failed to add');
    alert('Added to your collection!');
  }

  return (
    <div style={{ border:'1px solid #ddd', borderRadius:8, overflow:'hidden', background:'#fff', display:'flex', flexDirection:'column' }}>
      <img src={posterUrl} alt={movie.title} style={{ width:'100%', height:300, objectFit:'cover' }} />
      <div style={{ padding:'1rem' }}>
        <h3 style={{ margin:'0 0 0.5rem' }}>{movie.title}</h3>
        {release && <p style={{ margin:'0.2rem 0' }}><strong>Release:</strong> {release}</p>}
        {rating &&  <p style={{ margin:'0.2rem 0' }}><strong>Rating:</strong> ⭐ {rating}/10</p>}
        {movie.genres?.length > 0 && (
          <p style={{ margin:'0.2rem 0' }}><strong>Genres:</strong> {movie.genres.join(', ')}</p>
        )}
        {movie.overview && (
          <p style={{ marginTop:'0.5rem', fontSize:'0.9rem', lineHeight:1.4 }}>
            {movie.overview.length > 180 ? movie.overview.slice(0,180)+'…' : movie.overview}
          </p>
        )}
        {token && !onRemoved && (
          <button onClick={addToCollection} style={{ marginTop:8 }}>+ Add to Collection</button>
        )}
        {onRemoved && (
          <button onClick={()=>onRemoved(movie.tmdb_id)} style={{ marginTop:8, color:'crimson' }}>Remove</button>
        )}
      </div>
    </div>
  );
}
