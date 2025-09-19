import React from 'react';
import MovieCard from './MovieCard.jsx';

/**
 * Displays a list of MovieCard components.  If there are no movies
 * to display, shows a placeholder message.
 */
const MovieList = ({ movies }) => {
  if (!movies || movies.length === 0) {
    return <p>No movies found.  Try another search.</p>;
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
      {movies.map((movie) => (
        <MovieCard key={movie._id || movie.title} movie={movie} />
      ))}
    </div>
  );
};

export default MovieList;