import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

export default function Sidebar({ activeSection, onSelectSection }) {
  const { user } = useAuth();
  const userRole = user?.rol || user?.role || 'Cliente';

  const sections = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'storage', label: 'Almacenes' },
    { key: 'completed', label: 'Tareas completadas' },
    { key: 'editor', label: 'Abrir Editor' }
  ];

  // Mostrar "Gestión de Usuarios" solo si el rol es Administrador
  if (userRole === 'Administrador') {
    sections.push({ key: 'users', label: 'Gestión de Usuarios' });
  }

  return (
    <aside className="sidebar-container">
      <div className="sidebar-brand">CleverNote</div>
      <nav className="sidebar-nav">
        {sections.map((section) => (
          <button
            key={section.key}
            type="button"
            className={`sidebar-link ${activeSection === section.key ? 'active' : ''}`}
            onClick={() => onSelectSection(section.key)}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
