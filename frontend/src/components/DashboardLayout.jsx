import React, { useState } from 'react';
import './DashboardLayout.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MarkdownEditorView from './MarkdownEditorView';
import DataTable from './DataTable';
import LoadingSpinner from './LoadingSpinner';
import AlertMessage from './AlertMessage';

export default function DashboardLayout({ onLogout }) {
  const [activeSection, setActiveSection] = useState('editor');
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  return (
    <div className="dashboard-container">
      <Sidebar activeSection={activeSection} onSelectSection={setActiveSection} />

      <header className="navbar-container">
        <Navbar userName="Moisés" title="CleverNote / Dashboard" onLogout={onLogout} />
      </header>

      <main className="content-container">
        {showAlert ? (
          <AlertMessage
            type="error"
            message="No se pudo guardar el documento. Intenta de nuevo."
            onClose={() => setShowAlert(false)}
          />
        ) : null}

        <button
          type="button"
          className="demo-toggle"
          onClick={() => setIsLoading((prev) => !prev)}
        >
          {isLoading ? 'Ocultar carga' : 'Mostrar carga'}
        </button>

        {isLoading ? <LoadingSpinner text="Cargando contenido..." /> : null}

        {activeSection === 'completed' ? <DataTable /> : <MarkdownEditorView />}
      </main>
    </div>
  );
}
