import './App.css';
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import { AuthProvider, AuthContext } from './context/AuthContext';  
import Login from './pages/Login';  
import Home from './pages/Home';  
import NotFoundPage from './pages/NotFoundPage';  

// Componente de ruta protegida
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Cargando...</div>; // O cualquier indicador de carga
  }

  if (!isAuthenticated) return <Navigate to="/login" />; // Redirigir si no está autenticado

  return element; // Renderiza el componente protegido
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />  {/* Ruta para login */}

          {/* Ruta protegida */}
          <Route path="/home/*" element={<ProtectedRoute element={<Home />} />} />  {/* Ruta para home */}

          {/* Ruta por defecto para manejar el 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
