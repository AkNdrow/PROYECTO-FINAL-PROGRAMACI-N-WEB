import React, { useState } from 'react';
import './RegisterView.css';

export default function RegisterView({ onNavigateToLogin, onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name] || errors.general) {
      setErrors({ ...errors, [name]: '', general: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'El nombre es obligatorio.';
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!formData.email.trim()) {
      nextErrors.email = 'El correo es obligatorio.';
    } else if (!emailRegex.test(formData.email.trim())) {
      nextErrors.email = 'Correo no válido.';
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!formData.password) {
      nextErrors.password = 'La contraseña es obligatoria.';
    } else if (!passwordRegex.test(formData.password)) {
      nextErrors.password = 'La contraseña no cumple con los requisitos de seguridad.';
    }

    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:8000/api' : '/api');

      try {
        const response = await fetch(`${apiUrl}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name: formData.fullName.trim(),
            email: formData.email.trim(),
            password: formData.password,
            password_confirmation: formData.confirmPassword,
          }),
        });

        const responseText = await response.text();
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (jsonErr) {
          console.error('Respuesta no-JSON recibida del servidor:', responseText);
          throw new Error(`El servidor backend devolvió una respuesta no válida (HTTP ${response.status}). Revisa la ruta de la API.`);
        }

        if (!response.ok) {
          throw new Error(data.message || 'Error al registrar usuario');
        }

        // Si fue exitoso (201)
        alert('¡Cuenta creada con éxito! Se ha enviado un enlace a tu correo. Por favor, revísalo para verificar tu cuenta antes de iniciar sesión.');
        
        if (onNavigateToLogin) onNavigateToLogin();
      } catch (err) {
        setErrors({ general: err.message });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-brand">
          <h1>Crea tu cuenta</h1>
          <p>Únete a CleverNote y gestiona tus documentos Markdown.</p>
        </div>

        {errors.general && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>
            {errors.general}
          </div>
        )}

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Nombre Completo:</span>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Juan Pérez" disabled={loading} />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </label>

          <label className="field">
            <span>Fecha de nacimiento:</span>
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} disabled={loading} />
          </label>

          <label className="field">
            <span>Correo electrónico:</span>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="tu@correo.com" disabled={loading} />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </label>

          <label className="field">
            <span>Número de teléfono (opcional):</span>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+52 55 1234 5678" disabled={loading} />
          </label>

          {/* Campo Contraseña */}
          <label className="field">
            <span>Contraseña:</span>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={loading}
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#60a5fa',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                    <line x1="2" x2="22" y1="2" y2="22"/>
                  </svg>
                )}
              </button>
            </div>
            
            {/* Validadores visuales en tiempo real */}
            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ color: formData.password.length >= 8 ? '#4ade80' : '#94a3b8' }}>
                {formData.password.length >= 8 ? '✓' : '○'} Mínimo 8 caracteres
              </div>
              <div style={{ color: /[A-Z]/.test(formData.password) ? '#4ade80' : '#94a3b8' }}>
                {/[A-Z]/.test(formData.password) ? '✓' : '○'} Al menos 1 mayúscula
              </div>
              <div style={{ color: /\d/.test(formData.password) ? '#4ade80' : '#94a3b8' }}>
                {/\d/.test(formData.password) ? '✓' : '○'} Al menos 1 número
              </div>
              <div style={{ color: /[\W_]/.test(formData.password) ? '#4ade80' : '#94a3b8' }}>
                {/[\W_]/.test(formData.password) ? '✓' : '○'} Al menos 1 carácter especial
              </div>
            </div>

            {errors.password && <span className="error-message" style={{ marginTop: '0.5rem' }}>{errors.password}</span>}
          </label>

          {/* Campo Confirmar Contraseña */}
          <label className="field">
            <span>Confirmar contraseña:</span>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={loading}
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#60a5fa',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                    <line x1="2" x2="22" y1="2" y2="22"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </label>

          <button type="submit" className="register-button" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            ¿Ya tienes una cuenta?{' '}
          </span>
          <button
            type="button"
            onClick={onNavigateToLogin}
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
            Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
}