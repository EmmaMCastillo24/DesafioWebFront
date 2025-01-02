import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ClienteHome from '../components/ClienteHome.jsx';  // Componente para clientes
import EmpleadoHome from '../components/EmpleadoHome.jsx';  // Componente para empleados

const Home = () => {
  const { role } = useContext(AuthContext); // Obtener el rol del usuario
  // Mostrar un componente u otro dependiendo del rol
  return (
    <div>
      <h1>Bienvenido a nuestra tienda</h1>
      {role === 2 ? (
        <ClienteHome /> // Contenido específico para clientes
      ) : role === 1 ? (
        <EmpleadoHome /> // Contenido específico para empleados
      ) : (
        <p>Cargando contenido...</p> // Mientras no esté definido el rol
      )}
    </div>
  );
};

export default Home;
