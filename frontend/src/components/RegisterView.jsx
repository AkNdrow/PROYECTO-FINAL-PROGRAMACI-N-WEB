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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulación de registro por ahora
    onRegisterSuccess();
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

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Nombre Completo:</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Fecha de nacimiento:</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Correo electrónico:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
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
                required
              />
            </div>

            <div className="input-group">
              <label>Confirmar contraseña:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
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