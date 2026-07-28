import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar sesión inicial desde localStorage al arrancar la app
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
