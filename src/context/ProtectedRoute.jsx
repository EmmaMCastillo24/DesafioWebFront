import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

const ProtectedRoute = ({ element }) => {
    const { isAuthenticated } = useContext(AuthContext);
    console.log("Estado de autenticación:", isAuthenticated);
  
    if (!isAuthenticated) return <Navigate to="/login" />; // Redirigir si no está autenticado
  
    console.log("Componente protegido renderizado:", element);
    return element; // Renderiza el componente protegido
  };
  

export default ProtectedRoute;
