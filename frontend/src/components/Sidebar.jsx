import React from 'react';
import './Sidebar.css';

export default function Sidebar({ activeSection, onSelectSection }) {
  const sections = [
    { key: 'editor', label: 'Dashboard / Editor' },
    { key: 'completed', label: 'Tareas completadas' }
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
