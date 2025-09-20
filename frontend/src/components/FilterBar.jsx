export default function FilterBar({ onFilterChange }) {
  function handleChange(e) {
    const [field, order] = e.target.value.split(":");
    onFilterChange(field, order);
  }

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-slate-600">Filter & sort results</p>
      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-600">Sort by:</label>
        <select
          onChange={handleChange}
          className="h-10 px-3 rounded-lg border border-slate-300 bg-white shadow-sm"
        >
          <option value="title:asc">Title (A–Z)</option>
          <option value="title:desc">Title (Z–A)</option>
          <option value="year:desc">Release Year (Newest)</option>
          <option value="year:asc">Release Year (Oldest)</option>
          <option value="rating:desc">Rating (High → Low)</option>
          <option value="rating:asc">Rating (Low → High)</option>
        </select>
      </div>
    </div>
  );
}
