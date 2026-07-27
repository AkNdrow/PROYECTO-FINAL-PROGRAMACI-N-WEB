import React from 'react';
import './LoginView.css';

export default function LoginView({ onLogin, onNavigateToRegister }) {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-mark">CN</div>
          <h1>CleverNote</h1>
          <p>Organiza tus ideas y documentos de forma simple.</p>
        </div>

        <form
          className="login-form"
          onSubmit={(event) => {
            event.preventDefault();
            onLogin();
          }}
        >
          <label className="field">
            <span>Correo electrónico</span>
            <input type="email" placeholder="tu@correo.com" />
          </label>

          <label className="field">
            <span>Contraseña</span>
            <input type="password" placeholder="••••••••" />
          </label>

          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>

        {/* Enlace para ir al Registro */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            ¿No tienes una cuenta?{' '}
          </span>
          <button
            type="button"
            onClick={onNavigateToRegister}
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              cursor: 'pointer',
              fontSize: '0.85rem',
              textDecoration: 'underline',
              padding: 0
            }}
          >
            Regístrate
          </button>
        </div>
      </div>
    </div>
  );
}
