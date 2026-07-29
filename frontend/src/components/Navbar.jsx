import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar({ title = 'CleverNote / Dashboard', onLogout, onProfileSelect, onSettingsSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const userName = user?.nombre || user?.name || 'Usuario';
  const userRole = user?.rol || user?.role || 'Active';

  return (
    <div className="navbar-shell">
      <div className="navbar-breadcrumbs">
        <span className="navbar-title">{title}</span>
      </div>

      <div className="navbar-actions">
        <button type="button" className="navbar-quick-action">
          ⋯
        </button>

        <div className="navbar-profile-wrapper">
          <button
            type="button"
            className="navbar-profile"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <div className="profile-avatar" aria-label="avatar de usuario">
              {(userName && userName.length > 0 ? userName.charAt(0) : 'U').toUpperCase()}
            </div>
            <div className="profile-info">
              <span className="profile-name">{userName}</span>
              <span className="profile-role">{userRole}</span>
            </div>
          </button>

          {isOpen ? (
            <div className="dropdown-menu">
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setIsOpen(false);
                  onProfileSelect?.();
                }}
              >
                Perfil
              </button>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setIsOpen(false);
                  onSettingsSelect?.();
                }}
              >
                Ajustes
              </button>
              <button
                type="button"
                className="dropdown-item danger"
                onClick={() => {
                  setIsOpen(false);
                  onLogout?.();
                }}
              >
                Cerrar sesión
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
