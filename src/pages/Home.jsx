import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Box, Typography } from '@mui/material';
import ClienteHome from '../components/cliente/ClienteHome.jsx';  // Componente para clientes
import OperadorHome from '../components/operador/OperadorHome.jsx';  // Componente para empleados

const Home = () => {
  const { role, isAuthenticated, isLoading } = useContext(AuthContext); // Obtener el rol y el estado de autenticación

  // Mostrar mensaje de carga hasta que se haya verificado la autenticación y el rol
  if (isLoading) {
    return <Typography variant="h6">Cargando contenido...</Typography>; // Mensaje de carga
  }

  if (!isAuthenticated || role === null) {
    return <Typography variant="h6">Rol no definido...</Typography>; // Mensaje de rol no definido
  }

  return (
    <div>
      <Box 
        display="flex" 
        justifyContent="center" 
        width="100%"
        padding={2}
      >
        <Typography variant="h3">
          Mi tienda online
        </Typography>
      </Box>
      {role === 2 ? ( // Manejar el rol como número
        <ClienteHome /> // Contenido específico para clientes
      ) : role === 1 ? (
        <OperadorHome /> // Contenido específico para empleados
      ) : (
        <Typography variant="h6">Rol no definido...</Typography> // Si no está definido el rol
      )}
    </div>
  );
};

export default Home;
