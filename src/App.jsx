import './App.css'
import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; 
import { AuthProvider, AuthContext } from './context/AuthContext';  
import Login from './pages/Login';  
import Home from './pages/Home'; 


const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext); // Verificamos si el usuario está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Si no está autenticado, redirige a la página de login
  }
  return element; // Si está autenticado, renderiza el componente
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />  {/* Ruta para login */}

          {/* Rutas protegidas */}
          <Route path="/home" element={<ProtectedRoute element={<Home />} />} />  {/* Ruta para home, protegida por autenticación */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;