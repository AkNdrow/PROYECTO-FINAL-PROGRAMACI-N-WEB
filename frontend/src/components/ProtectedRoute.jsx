import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'grid',
        placeItems: 'center',
        minHeight: '100vh',
        background: '#020617',
        color: '#94a3b8'
      }}>
        <span>Verificando sesión...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.rol || user.role)) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', background: '#020617', color: '#f87171' }}>
        <h2>403 - Acceso Denegado</h2>
        <p>No tienes los permisos necesarios para ver esta página.</p>
        <button onClick={() => window.location.href = '/dashboard'} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Volver al Inicio
        </button>
      </div>
    );
  }

  return children;
}
