import React, { useState, useEffect } from 'react';
import AlertMessage from './AlertMessage';
import './LoginView.css';

export default function LoginView({ onLogin, onNavigateToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [alertData, setAlertData] = useState(null);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('verified') === '1') {
      setIsVerified(true);
      // Limpiar URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    let intervalId;
    if (errors.email && errors.email.includes('confirmar tu correo') && formData.email) {
      intervalId = setInterval(async () => {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:8000/api' : '/api');
          const response = await fetch(`${apiUrl}/check-email-verified?email=${encodeURIComponent(formData.email.trim())}`);
          const data = await response.json();
          if (data.verified) {
            clearInterval(intervalId);
            setErrors({});
            setAlertData({ type: 'success', message: '¡Tu correo ha sido verificado desde otro dispositivo! Iniciando sesión...' });
            
            // Automatically log them in by resubmitting the form
            setTimeout(() => {
               // We just call the logic inside handleSubmit directly since we know they are verified now
               // Let's use a hidden submit button or just call the fetch directly.
               // Since they already submitted once, we can just click a hidden ref or re-run handleSubmit
               document.getElementById('hidden-login-submit')?.click();
            }, 2000);
          }
        } catch (e) {
          // ignore network errors during polling
        }
      }, 3000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [errors.email, formData.email]);

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

  const handleResendEmail = async () => {
    if (!formData.email) return;
    setResending(true);
    setAlertData(null);
    const apiUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:8000/api' : '/api');
    try {
      const response = await fetch(`${apiUrl}/email/verification-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email: formData.email.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al reenviar el correo');
      }
      setAlertData({ type: 'success', message: '¡Correo reenviado! Por favor revisa tu bandeja de entrada.' });
    } catch (err) {
      setAlertData({ type: 'error', message: err.message });
    } finally {
      setResending(false);
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
          console.error('Respuesta no-JSON recibida del servidor:', responseText);
          throw new Error(`El servidor backend devolvió una respuesta no válida (HTTP ${response.status}). Revisa la ruta de la API.`);
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
        </div>

        {alertData && (
          <AlertMessage 
            type={alertData.type} 
            message={alertData.message} 
            onClose={() => setAlertData(null)} 
          />
        )}

        {isVerified && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            color: '#4ade80',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            ¡Correo verificado con éxito! Ya puedes iniciar sesión.
          </div>
        )}

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
            {errors.email && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                <span className="error-message">{errors.email}</span>
                {errors.email.includes('confirmar tu correo') && (
                  <button 
                    type="button" 
                    onClick={handleResendEmail} 
                    disabled={resending}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#60a5fa',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      textDecoration: 'underline',
                      textAlign: 'left',
                      padding: 0
                    }}
                  >
                    {resending ? 'Reenviando...' : 'Reenviar enlace de verificación'}
                  </button>
                )}
              </div>
            )}
          </label>

          <label className="field">
            <span>Contraseña</span>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error-input' : ''}
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
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? (
                  /* Ojo abierto */
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  /* Ojo tachado */
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" x2="22" y1="2" y2="22" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </label>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
          
          {/* Hidden button for auto-submitting from polling */}
          <button type="submit" id="hidden-login-submit" style={{ display: 'none' }}></button>
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