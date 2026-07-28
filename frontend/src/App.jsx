import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import MarkdownEditorView from './components/MarkdownEditorView';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppRoutes() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LoginView
            onLogin={(userData) => {
              login(userData || { email: 'usuario@demo.com' });
              navigate('/dashboard');
            }}
            onNavigateToRegister={() => navigate('/register')}
          />
        }
      />
      <Route
        path="/register"
        element={
          <RegisterView
            onNavigateToLogin={() => navigate('/login')}
            onRegisterSuccess={(userData) => {
              login(userData || { email: 'usuario@demo.com' });
              navigate('/dashboard');
            }}
          />
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout onLogout={() => { logout(); navigate('/login'); }}>
              <MarkdownEditorView />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/editor/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout onLogout={() => { logout(); navigate('/login'); }}>
              <MarkdownEditorView />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
