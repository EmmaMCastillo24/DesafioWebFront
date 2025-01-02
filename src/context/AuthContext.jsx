import React, { createContext, useState, useEffect } from 'react';

// Crear el contexto de autenticación
export const AuthContext = createContext();

// Crear el proveedor que contendrá el estado de autenticación
export const AuthProvider = ({ children }) => {
  // Estado de autenticación, token y rol
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);  // Agregar el estado para el rol

  // Verifica si hay un token y rol en localStorage al cargar la aplicación
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedRole = localStorage.getItem('authRole');  // Recuperar el rol

    if (storedToken && storedRole) {
      setToken(storedToken);  // Si el token está en localStorage, lo cargamos
      setRole(storedRole);    // Cargar el rol desde localStorage
      setIsAuthenticated(true);  // Usuario está autenticado
    }
  }, []);

  // Función de login, recibe un token y un rol
  const login = (newToken, newRole) => {
    setToken(newToken);        // Guardamos el token en el estado
    setRole(newRole);          // Guardamos el rol en el estado
    localStorage.setItem('authToken', newToken);  // Guardamos el token en localStorage
    localStorage.setItem('authRole', newRole);    // Guardamos el rol en localStorage
    setIsAuthenticated(true);  // Marcamos al usuario como autenticado
  };

  // Función de logout
  const logout = () => {
    setToken(null);            // Eliminamos el token del estado
    setRole(null);             // Eliminamos el rol del estado
    localStorage.removeItem('authToken');  // Eliminamos el token de localStorage
    localStorage.removeItem('authRole');   // Eliminamos el rol de localStorage
    setIsAuthenticated(false);  // Marcamos al usuario como no autenticado
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, role, login, logout }}>
      {children} {/* Envuelve los componentes hijos */}
    </AuthContext.Provider>
  );
};
