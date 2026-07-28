import React from 'react';
import './Navbar.css';

export default function Navbar({ userName = 'Usuario', title = 'CleverNote / Dashboard' }) {
  return (
    <div className="navbar-shell">
      <div className="navbar-breadcrumbs">
        <span className="navbar-title">{title}</span>
      </div>

      <div className="navbar-actions">
        <button type="button" className="navbar-quick-action">
          ⋯
        </button>

        <div className="navbar-profile">
          <div className="profile-avatar" aria-label="avatar de usuario">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <span className="profile-name">{userName}</span>
            <span className="profile-role">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
