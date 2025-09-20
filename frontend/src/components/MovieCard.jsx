export default function MovieCard({ movie, onAddToCollection }) {
  const posterUrl =
    (movie.poster && movie.poster !== "null" && movie.poster) ||
    (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/noposter.jpg");

  const rating =
    movie?.vote_average != null
      ? movie.vote_average.toFixed(1)
      : movie?.imdb?.rating != null
      ? Number(movie.imdb.rating).toFixed(1)
      : null;

  const release = movie.release_date || (movie.year ? String(movie.year) : "-");

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-glow transition transform hover:-translate-y-0.5">
      <div className="relative">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-80 object-cover bg-slate-200"
          loading="lazy"
        />
        {rating && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            ⭐ {rating}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 line-clamp-1">{movie.title}</h3>
        <p className="text-sm text-slate-600 mb-2">📅 {release}</p>
        {movie.overview && (
          <p className="text-sm text-slate-700 line-clamp-3">{movie.overview}</p>
        )}

        {onAddToCollection && (
          <button
            onClick={() => onAddToCollection(movie)}
            className="mt-3 w-full h-10 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
          >
            + Add to Collection
          </button>
        )}
      </div>
    </div>
  );
}
