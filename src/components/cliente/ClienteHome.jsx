import React, { useContext } from 'react';
import { Typography, AppBar, Toolbar, Button, Box } from '@mui/material';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import ListaProductos from './ListaProductos.jsx';
import TarjetaOrden from './TarjetaOrden.jsx';
import ListaOrdenes from './ListaOrdenes.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';

const ClienteHome = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            E-commerce Cliente
          </Typography>
          <Button color="inherit" component={NavLink} to="/home/listaProductos"> Productos </Button>
          <Button color="inherit" component={NavLink} to="/home/historialPedidos"> Historial pedidos </Button>
          <Button color="inherit" component={NavLink} to="/home/carrito"> Carrito </Button>
          <Button color="inherit" onClick={handleLogout}> Cerrar Sesión</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: 4, px: 3 }}>
        <Box id="pedidos" sx={{ mt: 4 }}>

          <Routes>
            <Route path="listaProductos" element={<ListaProductos />} />
            <Route path="historialPedidos" element={<ListaOrdenes />} />
            <Route path="carrito" element={<TarjetaOrden />} />
          </Routes>
        </Box>
      </Box>
    </div>
  );
};

export default ClienteHome;
