import React from 'react';

const MovieCard = ({ movie }) => {
  // Use Mongo field if available, else fallback to TMDB
 const posterUrl =
  movie.poster && movie.poster !== 'null'
    ? movie.poster
    : movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/noposter.jpg";


  // Prefer TMDB rating, else fallback to IMDb
  const rating =
    movie.vote_average != null
      ? movie.vote_average.toFixed(1)
      : movie.imdb?.rating != null
      ? movie.imdb.rating.toFixed(1)
      : null;

  // Prefer release_date (TMDB), else fallback to year
  const release =
    movie.release_date ||
    (movie.year ? movie.year.toString() : null);

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Poster */}
      {posterUrl && (
        <img
          src={posterUrl}
          alt={movie.title}
          style={{ width: '100%', height: 300, objectFit: 'cover' }}
        />
      )}

      {/* Info */}
      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 0.5rem' }}>{movie.title}</h3>

        {release && (
          <p style={{ margin: '0.2rem 0', color: '#555' }}>
            <strong>Release:</strong> {release}
          </p>
        )}

        {rating && (
          <p style={{ margin: '0.2rem 0', color: '#555' }}>
            <strong>Rating:</strong> ⭐ {rating}/10
          </p>
        )}

        {movie.genres?.length > 0 && (
          <p style={{ margin: '0.2rem 0', color: '#555' }}>
            <strong>Genres:</strong> {movie.genres.join(', ')}
          </p>
        )}

        {movie.overview && (
          <p
            style={{
              marginTop: '0.5rem',
              fontSize: '0.9rem',
              lineHeight: 1.4,
              color: '#333',
              flex: 1
            }}
          >
            {movie.overview.length > 180
              ? movie.overview.slice(0, 180) + '…'
              : movie.overview}
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
