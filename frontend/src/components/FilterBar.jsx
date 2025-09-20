/**
 * FilterBar.jsx
 * Client-side sorting controls.
 */
import React from 'react';

export default function FilterBar({ onFilterChange }) {
  const handleChange = (e) => {
    const [field, order] = e.target.value.split(':');
    onFilterChange(field, order);
  };
  return (
    <div style={{ marginBottom:'1rem', display:'flex', justifyContent:'flex-end' }}>
      <label style={{ marginRight:8 }}>Sort by:</label>
      <select onChange={handleChange} style={{ padding:'0.4rem' }}>
        <option value="title:asc">Title (A–Z)</option>
        <option value="title:desc">Title (Z–A)</option>
        <option value="year:desc">Release (Newest)</option>
        <option value="year:asc">Release (Oldest)</option>
        <option value="rating:desc">Rating (High→Low)</option>
        <option value="rating:asc">Rating (Low→High)</option>
      </select>
    </div>
  );
}
