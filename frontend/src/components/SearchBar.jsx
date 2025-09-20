import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        className="flex-1 h-11 px-4 rounded-xl border border-slate-300 
                   bg-white text-gray-900 placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 
                   shadow-sm"
        placeholder="Search by movie title..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        type="submit"
        className="h-11 px-5 rounded-xl bg-indigo-600 text-white 
                   font-medium shadow hover:bg-indigo-700 
                   transition-colors"
      >
        Search
      </button>
    </form>
  );
}
