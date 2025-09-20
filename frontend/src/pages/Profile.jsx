import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://movie-search-platform.onrender.com/api";

export default function Profile() {
  const { user, token } = useContext(AuthContext);
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/collections`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setCollection(data.movies || []))
      .catch(() => setCollection([]));
  }, [token]);

  async function removeFromCollection(tmdb_id) {
    if (!token) return;
    await fetch(`${API_BASE}/collections/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ tmdb_id })
    });
    setCollection((prev) => prev.filter((m) => m.tmdb_id !== tmdb_id));
  }

  if (!user) {
    return <p className="text-center text-slate-600">Please sign in first.</p>;
  }

  return (
    <div>
      <div className="bg-white rounded-2xl p-6 shadow mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Hi, {user.name} 👋</h2>
          <p className="text-slate-600">Manage your personal movie collection below.</p>
        </div>
        
      </div>

      {collection.length === 0 ? (
        <p className="text-center text-slate-600 mt-10">Your collection is empty.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {collection.map((m) => (
            <div key={m.tmdb_id} className="bg-white rounded-2xl overflow-hidden shadow">
              <img
                src={m.poster || "/noposter.jpg"}
                alt={m.title}
                className="w-full h-72 object-cover bg-slate-200"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold line-clamp-1">{m.title}</h3>
                <p className="text-sm text-slate-600 mb-3">{m.year ?? "-"}</p>
                <button
                  onClick={() => removeFromCollection(m.tmdb_id)}
                  className="w-full h-10 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
