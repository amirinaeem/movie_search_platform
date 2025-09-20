
import MovieCard from './MovieCard.jsx';

/**
 * Displays a responsive grid of MovieCard components.
 * Falls back to a friendly message if no movies are found.
 */
const MovieList = ({ movies }) => {
  if (!movies || movies.length === 0) {
    return (
      <p style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
        No movies found. Try another search 🎬
      </p>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginTop: '1rem',
      }}
    >
      {movies.map((movie) => (
        <MovieCard
          key={movie.tmdb_id || movie._id} // ✅ stable unique key
          movie={movie}
        />
      ))}
    </div>
  );
};

export default MovieList;
