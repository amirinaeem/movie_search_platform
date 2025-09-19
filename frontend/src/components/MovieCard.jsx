import React from 'react';

/**
 * A simple card component that displays information about a movie.
 */
const MovieCard = ({ movie }) => {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '1rem', background: '#fafafa' }}>
      <h3 style={{ marginTop: 0 }}>{movie.title}</h3>
      {movie.year && <p><strong>Year:</strong> {movie.year}</p>}
      {movie.imdb && movie.imdb.rating != null && (
        <p><strong>IMDb Rating:</strong> {movie.imdb.rating.toFixed ? movie.imdb.rating.toFixed(1) : movie.imdb.rating}</p>
      )}
      {movie.genres && movie.genres.length > 0 && (
        <p><strong>Genres:</strong> {movie.genres.join(', ')}</p>
      )}
      {movie.directors && movie.directors.length > 0 && (
        <p><strong>Directors:</strong> {movie.directors.join(', ')}</p>
      )}
    </div>
  );
};

export default MovieCard;