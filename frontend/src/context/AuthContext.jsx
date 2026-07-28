import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const CURRENT_APP_VERSION = '1.1.0';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validar versión de la aplicación para invalidar sesiones antiguas automáticamente
    const storedVersion = localStorage.getItem('clevernote_app_version');

    if (storedVersion !== CURRENT_APP_VERSION) {
      console.info('Nueva versión detectada. Limpiando sesiones antiguas de localStorage.');
      localStorage.removeItem('clevernote_token');
      localStorage.removeItem('clevernote_user');
      localStorage.setItem('clevernote_app_version', CURRENT_APP_VERSION);
    } else {
      const savedToken = localStorage.getItem('clevernote_token');
      const savedUser = localStorage.getItem('clevernote_user');

      if (savedToken) {
        setToken(savedToken);
      }
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          setUser({ email: savedUser });
        }
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, userToken = 'mock_token_12345') => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('clevernote_token', userToken);
    localStorage.setItem('clevernote_user', typeof userData === 'string' ? userData : JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('clevernote_token');
    localStorage.removeItem('clevernote_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token || !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
