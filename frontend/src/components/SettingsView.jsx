import React, { useState } from 'react';

export default function SettingsView() {
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    setPassword('');
    setPasswordSaved(true);
    window.setTimeout(() => setPasswordSaved(false), 2000);
  };

  return (
    <section className="dashboard-home">
      <div className="welcome-card">
        <p className="welcome-eyebrow">Ajustes</p>
        <h2>Preferencias de configuración</h2>
        <div className="project-meta" style={{ flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              Tema preferido
              <select
                value={theme}
                onChange={(event) => setTheme(event.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.2)', background: '#0f172a', color: '#f8fafc' }}
              >
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
              </select>
            </label>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(event) => setNotifications(event.target.checked)}
              />
              Recibir notificaciones
            </label>
          </div>
        </div>
      </div>

      <div className="welcome-card">
        <h2>Cambiar contraseña</h2>
        <form onSubmit={handlePasswordSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <label>
            Nueva contraseña
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              style={{ width: '100%', marginTop: '0.4rem', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.2)', background: '#0f172a', color: '#f8fafc' }}
            />
          </label>

          <button type="submit" className="demo-toggle" style={{ width: 'fit-content' }}>
            Actualizar contraseña
          </button>
          {passwordSaved ? <p style={{ color: '#7dd3fc' }}>Contraseña actualizada correctamente.</p> : null}
        </form>
      </div>
    </section>
  );
}
