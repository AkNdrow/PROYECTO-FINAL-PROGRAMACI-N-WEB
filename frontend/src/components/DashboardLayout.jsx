import React, { useState } from 'react';
import './DashboardLayout.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MarkdownEditorView from './MarkdownEditorView';
import AlertMessage from './AlertMessage';
import LoadingSpinner from './LoadingSpinner';
import Modal from './Modal';
import ProfileView from './ProfileView';
import SettingsView from './SettingsView';
import DocumentsView from './DocumentsView';
import { useAuth } from '../context/AuthContext';

function parseMarkdownToHtml(mdText) {
  if (!mdText) return '';

  let html = mdText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/^&gt;\s?(.*$)/gim, '<blockquote>$1</blockquote>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');
  html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  html = html
    .split('\n\n')
    .map((paragraph) => {
      if (paragraph.trim().startsWith('<h') || paragraph.trim().startsWith('<block') || paragraph.trim().startsWith('<ul')) {
        return paragraph;
      }
      return `<p>${paragraph.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('');

  return html;
}

export default function DashboardLayout({ onLogout, initialSection = 'dashboard' }) {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState(initialSection);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState('create');

  const displayName = user?.name || 'Moisés';

  const handleSave = () => {
    setShowAlert(true);
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  const openCreateModal = () => {
    setModalVariant('create');
    setIsModalOpen(true);
  };

  const openDeleteModal = () => {
    setModalVariant('delete');
    setIsModalOpen(true);
  };

  const showTemporaryLoader = () => {
    setIsLoading(true);
    window.setTimeout(() => setIsLoading(false), 1200);
  };

  const sectionTitles = {
    dashboard: 'Inicio',
    storage: 'Almacenes',
    completed: 'Tareas completadas',
    editor: 'Editor',
    profile: 'Perfil',
    settings: 'Ajustes'
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileView user={user} />;
      case 'settings':
        return <SettingsView />;
      case 'storage':
        return (
          <section className="dashboard-home">
            <div className="welcome-card storage-card">
              <p className="welcome-eyebrow">Almacenes</p>
              <h2>Centro de recursos del proyecto</h2>
              <p>Organiza documentos, entregables y referencias para el desarrollo web en un solo lugar.</p>
            </div>
          </section>
        );
      case 'completed':
        return (
          <section className="completed-section">
            <div className="section-header">
              <div>
                <p className="welcome-eyebrow">Resumen</p>
                <h2>Documentos y Entregables</h2>
              </div>
            </div>
            <DocumentsView />
          </section>
        );
      case 'editor':
        return (
          <section className="editor-actions-section">
            <div className="demo-actions">
              <button type="button" className="demo-toggle" onClick={showTemporaryLoader}>
                {isLoading ? 'Ocultar carga' : 'Mostrar carga'}
              </button>
              <button type="button" className="demo-toggle" onClick={openCreateModal}>
                Abrir crear/editar
              </button>
              <button type="button" className="demo-toggle danger" onClick={openDeleteModal}>
                Abrir eliminar
              </button>
            </div>

            {isLoading ? <LoadingSpinner text="Cargando contenido..." /> : null}
            <MarkdownEditorView onSave={handleSave} />
          </section>
        );
      case 'dashboard':
      default:
        return (
          <section className="dashboard-home">
            <div className="welcome-card">
              <p className="welcome-eyebrow">Bienvenido</p>
              <h1>CleverNote - Tablero de Proyectos</h1>
              <div className="project-meta">
                <span>Nombre del proyecto: Desarrollo web</span>
                <span>Estado: 5 Tareas pendientes</span>
                <span>Colaboradores: Andrés, Moisés</span>
              </div>
            </div>

            <div className="markdown-viewer-card">
              <h2>Descripción general del proyecto</h2>
              <div
                className="markdown-viewer__body"
                dangerouslySetInnerHTML={{
                  __html: parseMarkdownToHtml(`# Instrucciones iniciales

- Revisa las tareas pendientes del tablero.
- Actualiza el avance del proyecto cada mañana.
- Usa el editor para documentar decisiones y acuerdos.

> Mantén la comunicación clara con el equipo.

## Objetivo
El proyecto busca consolidar una experiencia visual limpia y colaborativa para el desarrollo web.`)
                }}
              />
            </div>
          </section>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeSection={activeSection} onSelectSection={setActiveSection} />

      <header className="navbar-container">
        <Navbar
          userName={displayName}
          title={`CleverNote / ${sectionTitles[activeSection] || 'Inicio'}`}
          onLogout={() => { logout(); onLogout?.(); }}
          onProfileSelect={() => setActiveSection('profile')}
          onSettingsSelect={() => setActiveSection('settings')}
        />
      </header>

      <main className="content-container">
        {renderContent()}

        <Modal
          isOpen={isModalOpen}
          title={modalVariant === 'delete' ? 'Eliminar documento' : 'Crear / Editar documento'}
          onClose={() => setIsModalOpen(false)}
        >
          {modalVariant === 'delete' ? (
            <>
              <p className="modal-message">¿Estás seguro de que deseas eliminar este documento?</p>
              <div className="modal-actions">
                <button type="button" className="modal-button secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="button" className="modal-button danger">
                  Confirmar eliminación
                </button>
              </div>
            </>
          ) : (
            <form className="modal-form">
              <div className="modal-field">
                <label>Título</label>
                <input type="text" placeholder="Nombre del documento" />
              </div>
              <div className="modal-field">
                <label>Categoría</label>
                <select defaultValue="Proyecto">
                  <option value="Proyecto">Proyecto</option>
                  <option value="Diseño">Diseño</option>
                  <option value="Reunión">Reunión</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="modal-button secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="button" className="modal-button primary">
                  Guardar
                </button>
              </div>
            </form>
          )}
        </Modal>

        {showAlert && (
          <AlertMessage
            message="Documento guardado correctamente."
            onClose={closeAlert}
          />
        )}
      </main>
    </div>
  );
}
