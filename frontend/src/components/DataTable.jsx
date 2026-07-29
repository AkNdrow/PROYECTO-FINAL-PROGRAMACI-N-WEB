import React from 'react';
import './DataTable.css';

export default function DataTable({ documents = [], loading = false }) {
  return (
    <div className="table-card">
      <div className="table-header">
        <div>
          <h3>Documentos recientes</h3>
          <p>Lista de archivos y notas actuales</p>
        </div>
        <button type="button" className="table-action">
          + Nuevo
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Título del archivo</th>
            <th>Fecha de creación</th>
            <th>Categoría</th>
            <th>Autor</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Cargando documentos...</td>
            </tr>
          ) : documents.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No se encontraron documentos</td>
            </tr>
          ) : (
            documents.map((row) => (
              <tr key={row.id}>
                <td>{row.titulo}</td>
                <td>{row.fecha_creacion}</td>
                <td>{row.tipo}</td>
                <td>{row.autor}</td>
                <td>
                  <span className="table-status">{row.estado}</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
