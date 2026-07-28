import React from 'react';
import './LoadingSpinner.css';

export default function LoadingSpinner({ text = 'Cargando...' }) {
  return (
    <div className="spinner-wrapper" role="status" aria-live="polite">
      <div className="spinner-circle" />
      {text ? <span className="spinner-text">{text}</span> : null}
    </div>
  );
}
