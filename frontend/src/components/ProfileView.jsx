import React, { useState } from 'react';

export default function ProfileView({ user = {} }) {
  const [name, setName] = useState(user.name || 'Nombre de usuario');
  const [email, setEmail] = useState(user.email || 'usuario@correo.com');
  const [role] = useState(user.role || 'Usuario');
  const [createdAt] = useState(user.created_at || user.createdAt || '2026-01-01');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <section className="dashboard-home">
      <div className="welcome-card">
        <p className="welcome-eyebrow">Perfil</p>
        <h2>Información de usuario</h2>
        <div className="project-meta" style={{ flexDirection: 'column', gap: '0.75rem' }}>
          <span>Nombre: {name}</span>
          <span>Correo: {email}</span>
          <span>Rol: {role}</span>
          <span>Fecha de registro: {createdAt}</span>
        </div>
      </div>

      <div className="welcome-card">
        <h2>Editar datos</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <label>
            Nombre
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              style={{ width: '100%', marginTop: '0.4rem', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.2)', background: '#0f172a', color: '#f8fafc' }}
            />
          </label>

          <label>
            Correo electrónico
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={{ width: '100%', marginTop: '0.4rem', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.2)', background: '#0f172a', color: '#f8fafc' }}
            />
          </label>

          <button
            type="submit"
            className="demo-toggle"
            style={{ width: 'fit-content' }}
          >
            Guardar cambios
          </button>

          {saved ? <p style={{ color: '#7dd3fc' }}>Perfil guardado correctamente.</p> : null}
        </form>
      </div>
    </section>
  );
}
