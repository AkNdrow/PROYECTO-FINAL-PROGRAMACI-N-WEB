import React, { useState } from 'react';
import './DashboardLayout.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MarkdownEditorView from './MarkdownEditorView';
import DataTable from './DataTable';

export default function DashboardLayout({ onLogout }) {
  const [activeSection, setActiveSection] = useState('editor');

  return (
    <div className="dashboard-container">
      <Sidebar activeSection={activeSection} onSelectSection={setActiveSection} />

      <header className="navbar-container">
        <Navbar userName="Moisés" title="CleverNote / Dashboard" onLogout={onLogout} />
      </header>

      <main className="content-container">
        {activeSection === 'completed' ? <DataTable /> : <MarkdownEditorView />}
      </main>
    </div>
  );
}
