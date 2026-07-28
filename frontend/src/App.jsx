import React, { useState } from 'react';
import MarkdownEditorView from './components/MarkdownEditorView';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import DashboardLayout from './components/DashboardLayout';

export default function App() {
  const [currentView, setCurrentView] = useState('login');

  if (currentView === 'register') {
    return (
      <RegisterView
        onNavigateToLogin={() => setCurrentView('login')}
        onRegisterSuccess={() => setCurrentView('editor')}
      />
    );
  }

  if (currentView === 'login') {
    return (
      <LoginView
        onLogin={() => setCurrentView('editor')}
        onNavigateToRegister={() => setCurrentView('register')}
      />
    );
  }

  return <DashboardLayout onLogout={() => setCurrentView('login')} />;
}
