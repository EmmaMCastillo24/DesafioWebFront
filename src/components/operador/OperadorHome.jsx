import React, { useContext } from 'react';
import { Typography, AppBar, Toolbar, Button, Box } from '@mui/material';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import FormCliente from './FormCliente.jsx';
import FormProducto from './FormProducto.jsx';
import TablaOrden from './TablaOrden.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';

const OperadorHome = () => {
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
            E-commerce Operador
          </Typography>
          <Button color="inherit" component={NavLink} to="/home/clientes"> Clientes </Button>
          <Button color="inherit" component={NavLink} to="/home/productos"> Productos </Button>
          <Button color="inherit" component={NavLink} to="/home/ordenes"> Historial ordenes </Button>
          <Button color="inherit" onClick={handleLogout}> Cerrar Sesión</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: 4, px: 3 }}>
        <Box id="pedidos" sx={{ mt: 4 }}>

          <Routes>
            <Route path="clientes" element={<FormCliente />} />
            <Route path="productos" element={<FormProducto />} />
            <Route path="ordenes" element={<TablaOrden />} />
          </Routes>
        </Box>
      </Box>
    </div>
  );
};

export default OperadorHome;
