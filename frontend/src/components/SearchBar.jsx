import React, { useState } from 'react';
import './SearchBar.css';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (onSearch) onSearch(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="searchbar-wrapper">
      <div className="searchbar-input-group">
        <span className="searchbar-icon">⌕</span>
        <input 
          type="text" 
          placeholder="Buscar documentos..." 
          className="searchbar-input" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <button type="button" className="searchbar-button" onClick={handleSearch}>
        Filtrar
      </button>
    </div>
  );
}
