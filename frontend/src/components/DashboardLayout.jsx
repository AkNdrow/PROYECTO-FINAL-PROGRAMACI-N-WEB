import React from 'react';
import './DashboardLayout.css';

export default function DashboardLayout({ children, onLogout }) {
  return (
    <div className="dashboard-container">
      <aside className="sidebar-container">
        <div className="sidebar-brand">CleverNote</div>
        <nav className="sidebar-nav">
          <button type="button" className="sidebar-link active">
            Editor
          </button>
          <button type="button" className="sidebar-link">
            Archivos
          </button>
          <button type="button" className="sidebar-link">
            Exportar
          </button>
        </nav>
      </aside>

      <header className="navbar-container">
        <span className="navbar-title">Panel de edición</span>
        {onLogout ? (
          <button type="button" className="navbar-action" onClick={onLogout}>
            Cerrar sesión
          </button>
        ) : null}
      </header>

      <main className="content-container">{children}</main>
    </div>
  );
}
