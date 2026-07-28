import React from 'react';
import './Sidebar.css';

export default function Sidebar({ activeSection, onSelectSection }) {
  const sections = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'storage', label: 'Almacenes' },
    { key: 'completed', label: 'Tareas completadas' },
    { key: 'editor', label: 'Abrir Editor' }
  ];

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
