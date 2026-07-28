import React, { useState } from 'react';
import './DashboardLayout.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MarkdownEditorView from './MarkdownEditorView';
import DataTable from './DataTable';
import LoadingSpinner from './LoadingSpinner';
import AlertMessage from './AlertMessage';
import Pagination from './Pagination';
import SearchBar from './SearchBar';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ onLogout }) {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('editor');
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState('create');

  let displayName = 'Usuario';
  if (typeof user === 'object' && user !== null) {
    if (user.name) displayName = user.name;
    else if (user.fullName) displayName = user.fullName;
    else if (user.email) {
      const uname = user.email.split('@')[0];
      displayName = uname.charAt(0).toUpperCase() + uname.slice(1);
    }
  } else if (typeof user === 'string' && user.length > 0) {
    if (user.includes('@')) {
      const uname = user.split('@')[0];
      displayName = uname.charAt(0).toUpperCase() + uname.slice(1);
    } else {
      displayName = user;
    }
  }

  const handleSave = () => {
    console.log('Clic en Guardar');
    setShowAlert(true);
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeSection={activeSection} onSelectSection={setActiveSection} />

      <header className="navbar-container">
        <Navbar userName={displayName} title="CleverNote / Dashboard" onLogout={onLogout} />
      </header>

      <main className="content-container">
        <button
          type="button"
          className="demo-toggle"
          onClick={() => setIsLoading((prev) => !prev)}
        >
          {isLoading ? 'Ocultar carga' : 'Mostrar carga'}
        </button>

        <div className="demo-actions">
          <button
            type="button"
            className="demo-toggle"
            onClick={() => {
              setModalVariant('create');
              setIsModalOpen(true);
            }}
          >
            Abrir crear/editar
          </button>
          <button
            type="button"
            className="demo-toggle danger"
            onClick={() => {
              setModalVariant('delete');
              setIsModalOpen(true);
            }}
          >
            Abrir eliminar
          </button>
        </div>

        {isLoading ? <LoadingSpinner text="Cargando contenido..." /> : null}

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
                <button type="button" className="modal-button primary" onClick={() => setShowAlert(true)}>
                  Guardar
                </button>
              </div>
            </form>
          )}
        </Modal>

        {activeSection === 'completed' ? (
          <div>
            <SearchBar />
            <DataTable />
            <Pagination />
          </div>
        ) : (
          <MarkdownEditorView onSave={handleSave} />
        )}

        {showAlert && (
          <AlertMessage
            message="No se pudo guardar el documento. Intenta de nuevo."
            onClose={closeAlert}
          />
        )}
      </main>
    </div>
  );
}
