import React, { useEffect } from 'react';
import './AlertMessage.css';

export default function AlertMessage({ type = 'info', message, onClose }) {
  const typeClass = `alert-${type}`;

  useEffect(() => {
    if (!onClose) return undefined;

    const timer = window.setTimeout(() => {
      onClose();
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`alert-message alert-visible ${typeClass}`} role="alert">
      <div className="alert-content">
        <strong>{type === 'error' ? 'Error' : type === 'success' ? 'Éxito' : 'Información'}</strong>
        <span>{message}</span>
      </div>
    </div>
  );
}
