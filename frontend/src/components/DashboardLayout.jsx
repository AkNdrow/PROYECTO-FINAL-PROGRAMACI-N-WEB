import React from 'react';
import './DashboardLayout.css';
import Navbar from './Navbar';

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
        <Navbar userName="Moisés" title="CleverNote / Dashboard" />
      </header>

      <main className="content-container">{children}</main>
    </div>
  );
}
