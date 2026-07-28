import React from 'react';
import './DataTable.css';

const rows = [
  {
    id: 1,
    name: 'Plan de sprint.md',
    modified: '2026-07-27',
    category: 'Proyecto',
    status: 'Listo'
  },
  {
    id: 2,
    name: 'Resumen ejecutivo.md',
    modified: '2026-07-25',
    category: 'Reunión',
    status: 'Pendiente'
  },
  {
    id: 3,
    name: 'Notas de diseño.txt',
    modified: '2026-07-24',
    category: 'Diseño',
    status: 'Listo'
  }
];

export default function DataTable() {
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
            <th>Nombre del archivo</th>
            <th>Fecha de modificación</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.modified}</td>
              <td>{row.category}</td>
              <td>
                <span className="table-status">{row.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
