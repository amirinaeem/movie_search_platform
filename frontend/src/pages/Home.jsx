// frontend/src/pages/Home.jsx
import { useEffect, useState, useContext } from "react";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import MovieList from "../components/MovieList";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://movie-search-platform.onrender.com/api";

export default function Home() {
  const { token } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadInitial();
  }, []);

  async function loadInitial() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/movies?limit=20&sort=year&order=desc`);
      const data = await res.json();
      setMovies(data.items || []);
      setFiltered(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(query) {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/tmdb/search?title=${encodeURIComponent(query)}`);
      const data = await res.json();
      setMovies(data);
      setFiltered(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Restored filter function
  function handleFilterChange(field, order) {
    const sorted = [...movies].sort((a, b) => {
      const aTitle = (a.title || "").toLowerCase();
      const bTitle = (b.title || "").toLowerCase();
      const aYear = a.year || 0, bYear = b.year || 0;
      const aRating = a.imdb?.rating ?? a.vote_average ?? 0;
      const bRating = b.imdb?.rating ?? b.vote_average ?? 0;

      let av, bv;
      if (field === "title") { av = aTitle; bv = bTitle; }
      else if (field === "year") { av = aYear; bv = bYear; }
      else { av = aRating; bv = bRating; }

      if (av < bv) return order === "asc" ? -1 : 1;
      if (av > bv) return order === "asc" ? 1 : -1;
      return 0;
    });
    setFiltered(sorted);
  }

  async function handleAddToCollection(movie) {
    if (!token) {
      toast.error("Please sign in to add to your collection.");
      return;
    }
    try {
      await fetch(`${API_BASE}/collections/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          movie: {
            tmdb_id: movie.tmdb_id ?? movie.id,
            title: movie.title,
            year: movie.year ?? (movie.release_date ? Number(movie.release_date.split("-")[0]) : null),
            poster: movie.poster ?? (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/noposter.jpg"),
            overview: movie.overview || "",
            rating: movie.imdb?.rating ?? movie.vote_average ?? null,
          }
        })
      });
      toast.success("Added to your collection!");
    } catch (e) {
      toast.error("Could not add to collection.");
    }
  }

  return (
    <>
      {/* Hero */}
      <div className="bg-indigo-600 text-white rounded-2xl p-8 shadow mb-6">
        <h1 className="text-3xl font-bold">Find your next favorite movie</h1>
        <p className="opacity-90 mt-1">Search titles, sort by year or rating, and build your collection.</p>
        <div className="mt-5">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <FilterBar onFilterChange={handleFilterChange} />

      {loading && <p className="mt-6 text-slate-600">Loading…</p>}
      {error && <p className="mt-6 text-rose-600">{error}</p>}

      <MovieList movies={filtered} onAddToCollection={handleAddToCollection} />
    </>
  );
}
