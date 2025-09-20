// frontend/components/FilterBar.jsx
import React from 'react';

const FilterBar = ({ onFilterChange }) => {
  const handleChange = (e) => {
    const [field, order] = e.target.value.split(':');
    onFilterChange(field, order);
  };

  return (
    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
      <label style={{ marginRight: '0.5rem', fontWeight: '500' }}>Sort by:</label>
      <select
        onChange={handleChange}
        style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
      >
        <option value="title:asc">Title (A–Z)</option>
        <option value="title:desc">Title (Z–A)</option>
        <option value="year:desc">Release Year (Newest)</option>
        <option value="year:asc">Release Year (Oldest)</option>
        <option value="rating:desc">Rating (High → Low)</option>
        <option value="rating:asc">Rating (Low → High)</option>
      </select>
    </div>
  );
};

export default FilterBar;
