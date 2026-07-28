import { useState } from 'react';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'El nombre completo es obligatorio.';
    }

    if (!formData.birthDate) {
      nextErrors.birthDate = 'La fecha de nacimiento es obligatoria.';
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Por favor, ingresa tu correo electrónico.';
    } else if (!emailRegex.test(formData.email.trim())) {
      nextErrors.email = 'Ingresa un correo electrónico válido (ejemplo@dominio.com).';
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!formData.password) {
      nextErrors.password = 'Por favor, ingresa una contraseña.';
    } else if (!passwordRegex.test(formData.password)) {
      nextErrors.password = 'La contraseña debe tener al menos 8 caracteres, incluir al menos una letra mayúscula, una minúscula y un número.';
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = 'Por favor, confirma tu contraseña.';
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:8000/api' : '/api');

      // Función auxiliar para registrar en base de datos local (localStorage)
      const saveUserLocally = () => {
        const registeredUsers = JSON.parse(localStorage.getItem('clevernote_registered_users') || '[]');
        const newUser = {
          fullName: formData.fullName.trim(),
          name: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        };
        const existingIndex = registeredUsers.findIndex(u => u.email === newUser.email);
        if (existingIndex >= 0) {
          registeredUsers[existingIndex] = newUser;
        } else {
          registeredUsers.push(newUser);
        }
        localStorage.setItem('clevernote_registered_users', JSON.stringify(registeredUsers));
        localStorage.setItem('clevernote_user', JSON.stringify(newUser));
      };

      try {
        const response = await fetch(`${apiUrl}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name: formData.fullName.trim(),
            fullName: formData.fullName.trim(),
            birthDate: formData.birthDate,
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.errors) {
            const backendErrors = {};
            if (data.errors.email) backendErrors.email = data.errors.email[0];
            if (data.errors.password) backendErrors.password = data.errors.password[0];
            if (data.errors.name || data.errors.fullName) backendErrors.fullName = (data.errors.name || data.errors.fullName)[0];
            setErrors(backendErrors);
            return;
          }
          throw new Error(data.message || 'Error al registrar usuario');
        }

        saveUserLocally();

        if (data.access_token || data.token) {
          localStorage.setItem('clevernote_token', data.access_token || data.token);
        }
        if (data.user) {
          localStorage.setItem('clevernote_user', JSON.stringify(data.user));
        }

        onRegisterSuccess(data.user || { fullName: formData.fullName.trim(), email: formData.email.trim() });
      } catch (err) {
        if (err.name === 'TypeError' || err.message.includes('Failed to fetch')) {
          console.warn('API backend desconectada. Registrando usuario en modo local simulado.');
          saveUserLocally();
          onRegisterSuccess({ fullName: formData.fullName.trim(), email: formData.email.trim() });
        } else {
          setErrors({ general: err.message || 'Error al crear la cuenta' });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-brand">
          <h2>Crea tu cuenta</h2>
          <p>Únete a CleverNote y gestiona tus documentos Markdown.</p>
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

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label>Nombre Completo:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? 'error-input' : ''}
              disabled={loading}
              placeholder="Juan Pérez"
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          <div className="input-group">
            <label>Fecha de nacimiento:</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className={errors.birthDate ? 'error-input' : ''}
              disabled={loading}
            />
            {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
          </div>

          <div className="input-group">
            <label>Correo electrónico:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error-input' : ''}
              disabled={loading}
              placeholder="tu@correo.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="input-group">
            <label>Número de teléfono (opcional):</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
              placeholder="+52 55 1234 5678"
            />
          </div>

          <div className="input-group">
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error-input' : ''}
              disabled={loading}
              placeholder="••••••••"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="input-group">
            <label>Confirmar contraseña:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error-input' : ''}
              disabled={loading}
              placeholder="••••••••"
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="login-link-container">
          <span>¿Ya tienes una cuenta?</span>
          <button type="button" onClick={onNavigateToLogin} className="btn-secondary" disabled={loading}>
            Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
}