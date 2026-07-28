import React from 'react';
import './SearchBar.css';

export default function SearchBar() {
  return (
    <div className="searchbar-wrapper">
      <div className="searchbar-input-group">
        <span className="searchbar-icon">⌕</span>
        <input type="text" placeholder="Buscar..." className="searchbar-input" />
      </div>
      <button type="button" className="searchbar-button">
        Filtrar
      </button>
    </div>
  );
}
