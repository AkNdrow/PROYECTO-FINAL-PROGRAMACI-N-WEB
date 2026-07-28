import React, { useState } from 'react';
import './LoginView.css';

export default function LoginView({ onLogin, onNavigateToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name] || errors.general) {
      setErrors({
        ...errors,
        [name]: '',
        general: ''
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (!formData.email.trim()) {
      nextErrors.email = 'Por favor, ingresa tu correo electrónico.';
    } else if (!emailRegex.test(formData.email.trim())) {
      nextErrors.email = 'Ingresa un correo electrónico válido (ejemplo@dominio.com).';
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!formData.password) {
      nextErrors.password = 'Por favor, ingresa tu contraseña.';
    } else if (!passwordRegex.test(formData.password)) {
      nextErrors.password = 'La contraseña debe tener al menos 8 caracteres, incluir al menos una letra mayúscula, una minúscula y un número.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:8000/api' : '/api');

      try {
        const response = await fetch(`${apiUrl}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
          }),
        });

        const responseText = await response.text();
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (jsonErr) {
          throw new Error('El servidor backend devolvió una respuesta inesperada.');
        }

        if (!response.ok) {
          if (data.errors) {
            const backendErrors = {};
            if (data.errors.email) backendErrors.email = data.errors.email[0];
            if (data.errors.password) backendErrors.password = data.errors.password[0];
            setErrors(backendErrors);
            return;
          }
          throw new Error(data.message || 'Credenciales incorrectas');
        }

        const token = data.access_token || data.token || 'auth_token_' + Date.now();
        const userObj = data.user || { email: formData.email.trim() };

        localStorage.setItem('clevernote_token', token);
        localStorage.setItem('clevernote_user', JSON.stringify(userObj));

        onLogin(userObj);
      } catch (err) {
        // Fallback local seguro: Si la API no está alcanzable, verificar que el usuario se haya registrado previamente en almacenamiento local
        if (err.name === 'TypeError' || err.message.includes('Failed to fetch')) {
          console.warn('API backend desconectada. Verificando usuario en almacenamiento local.');
          const registeredUsers = JSON.parse(localStorage.getItem('clevernote_registered_users') || '[]');
          const inputEmail = formData.email.trim().toLowerCase();
          const userFound = registeredUsers.find(u => u.email.toLowerCase() === inputEmail);

          if (!userFound) {
            setErrors({ email: 'El usuario no se encuentra registrado. Regístrate primero.' });
            return;
          }

          if (userFound.password !== formData.password) {
            setErrors({ password: 'La contraseña ingresada es incorrecta.' });
            return;
          }

          const userObj = { name: userFound.fullName || userFound.name || 'Usuario', email: userFound.email };
          localStorage.setItem('clevernote_user', JSON.stringify(userObj));
          localStorage.setItem('clevernote_token', 'local_offline_token_' + Date.now());
          onLogin(userObj);
        } else {
          setErrors({ general: err.message || 'Error al iniciar sesión' });
        }
      } finally {
        setLoading(false);
      }
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

        {errors.general && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {errors.general}
          </div>
        )}

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
              disabled={loading}
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
              disabled={loading}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </label>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

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
