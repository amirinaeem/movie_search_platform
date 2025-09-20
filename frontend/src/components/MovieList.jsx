import MovieCard from "./MovieCard";

export default function MovieList({ movies, onAddToCollection }) {
  if (!movies || movies.length === 0) {
    return (
      <p className="text-center text-slate-600 mt-10">
        No movies found. Try another search 🎬
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mt-6">
      {movies.map((m) => (
        <MovieCard
          key={m.tmdb_id || m._id || m.id || m.title}
          movie={m}
          onAddToCollection={onAddToCollection}
        />
      ))}
    </div>
  );
}
