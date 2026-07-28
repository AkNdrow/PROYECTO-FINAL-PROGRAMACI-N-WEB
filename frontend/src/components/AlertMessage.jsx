import React from 'react';
import './AlertMessage.css';

export default function AlertMessage({ type = 'info', message, onClose }) {
  const typeClass = `alert-${type}`;

  return (
    <div className={`alert-message ${typeClass}`} role="alert">
      <div className="alert-content">
        <strong>{type === 'error' ? 'Error' : type === 'success' ? 'Éxito' : 'Información'}</strong>
        <span>{message}</span>
      </div>
      {onClose ? (
        <button type="button" className="alert-close" onClick={onClose} aria-label="Cerrar alerta">
          ×
        </button>
      ) : null}
    </div>
  );
}
