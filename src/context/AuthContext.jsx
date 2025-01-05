import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedRole = localStorage.getItem('authRole');
    const storedUsuario = localStorage.getItem('usuario'); // Obtener usuario

    if (storedToken && storedRole && storedUsuario) {
      setToken(storedToken);
      setRole(Number(storedRole)); // Convertir el rol a número
      setUsuario(storedUsuario); // Establecer usuario
      setIsAuthenticated(true);
    }
    setIsLoading(false); // Finaliza la carga
  }, []);

  const login = (newToken, newRole, newUser) => {
    setToken(newToken);
    setRole(newRole);
    setUsuario(newUser);
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('authRole', newRole);
    localStorage.setItem('usuario', newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUsuario(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authRole');
    localStorage.removeItem('usuario');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, role, usuario, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
