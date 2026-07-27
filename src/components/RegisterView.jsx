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

  const handleChange = (e) => {
    const { name, value } = e.target;
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'El nombre completo es obligatorio.';
    }

    if (!formData.birthDate) {
      nextErrors.birthDate = 'La fecha de nacimiento es obligatoria.';
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Por favor, ingresa un correo electrónico válido.';
    }

    if (!formData.password) {
      nextErrors.password = 'Por favor, ingresa una contraseña.';
    } else if (formData.password.length < 6) {
      nextErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = 'Por favor, confirma tu contraseña.';
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      onRegisterSuccess();
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        {/* Columna Izquierda: Información */}
        <div className="info-section">
          <h1>Bienvenido a CleverNote</h1>
          <p>
            CleverNote es una plataforma centralizada para la gestión de tus notas
            y documentos en Markdown. Organiza, edita y consulta tu información
            de manera rápida y eficiente desde cualquier lugar.
          </p>
        </div>

        {/* Columna Derecha: Formulario */}
        <div className="form-section">
          <h2>Crea tu cuenta</h2>
          <p className="subtitle">Introduce tus datos</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label>Nombre Completo:</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={errors.fullName ? 'error-input' : ''}
                required
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
                required
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
                required
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label>Número de teléfono:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
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
                required
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
                required
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="btn-primary">
              Crear cuenta
            </button>
          </form>

          <div className="login-link-container">
            <span>¿Ya tienes una cuenta?</span>
            <button type="button" onClick={onNavigateToLogin} className="btn-secondary">
              Inicia sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}