import React from 'react';
import './Pagination.css';

export default function Pagination() {
  return (
    <div className="pagination-wrapper">
      <div className="pagination-controls">
        <button type="button" className="pagination-button">
          Anterior
        </button>

        <div className="pagination-pages">
          <button type="button" className="page-button active">
            1
          </button>
          <button type="button" className="page-button">
            2
          </button>
          <button type="button" className="page-button">
            3
          </button>
        </div>

        <button type="button" className="pagination-button">
          Siguiente
        </button>
      </div>

      <label className="pagination-select-wrap">
        <span>Ver</span>
        <select className="pagination-select" defaultValue="10">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
        <span>registros</span>
      </label>
    </div>
  );
}
