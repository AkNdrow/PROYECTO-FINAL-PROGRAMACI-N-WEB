import React, { useState } from 'react';
import './LoginView.css';

export default function LoginView({ onLogin, onNavigateToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = 'Por favor, ingresa un correo electrónico válido.';
    }

    if (!formData.password) {
      nextErrors.password = 'Por favor, ingresa tu contraseña.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      onLogin();
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-mark">CN</div>
          <h1>CleverNote</h1>
          <p>Organiza tus ideas y documentos de forma simple.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Correo electrónico</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error-input' : ''}
              placeholder="tu@correo.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </label>

          <label className="field">
            <span>Contraseña</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error-input' : ''}
              placeholder="••••••••"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
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
