import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import MarkdownEditorView from './components/MarkdownEditorView';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import DashboardLayout from './components/DashboardLayout';

export default function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LoginView
            onLogin={() => navigate('/dashboard')}
            onNavigateToRegister={() => navigate('/register')}
          />
        }
      />
      <Route
        path="/register"
        element={
          <RegisterView
            onNavigateToLogin={() => navigate('/login')}
            onRegisterSuccess={() => navigate('/dashboard')}
          />
        }
      />
      <Route
        path="/dashboard"
        element={
          <DashboardLayout onLogout={() => navigate('/login')}>
            <MarkdownEditorView />
          </DashboardLayout>
        }
      />
      <Route
        path="/editor/:id"
        element={
          <DashboardLayout onLogout={() => navigate('/login')}>
            <MarkdownEditorView />
          </DashboardLayout>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
