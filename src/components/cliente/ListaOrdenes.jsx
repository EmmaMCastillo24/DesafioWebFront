import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Button } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';

const ListaOrdenes = () => {
  // Estado para almacenar los pedidos
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, role, usuario } = useContext(AuthContext);

  // cancelar la orden
  const handleCancelOrder = async (idOrden) => {
    try {
      setLoading(true); 

      const response = await fetch('http://localhost:4000/api/orden', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'rolId': role,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idOrden: idOrden, 
          idEstado: 6,  // Estado "Cancelado"
          idUsuario: usuario 
        }),
      });

      if (!response.ok) {
        throw new Error('Error al cancelar la orden');
      }

      const data = await response.json();
      console.log('Orden cancelada', data);

      // Mostrar mensaje de éxito con SweetAlert2
      Swal.fire({
        title: 'Éxito',
        text: 'La orden ha sido cancelada con éxito.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });

      // Recargar la lista de pedidos para no mostrar el botón de cancelar
      fetchPedidos();

    } catch (error) {
      console.error('Hubo un error:', error);

      // Mostrar mensaje de error con SweetAlert2
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al cancelar la orden.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setLoading(false); // Finalizar el estado de carga
    }
  };

  // Cargar los pedidos desde la API
  const fetchPedidos = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/api/ordenes`, {
        idUsuario: usuario,  
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'rolId': role,
        },
        responseType: 'json'
      });
      setPedidos(response.data.data);

    } catch (err) {
      console.log(err);
      setError('Hubo un error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, [usuario, token, role]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <Card elevation={3} sx={{ marginTop: 2 }}>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
          Lista de Pedidos Realizados
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="body1" fontWeight="bold">Fecha de Creación</Typography></TableCell>
                <TableCell><Typography variant="body1" fontWeight="bold">Total</Typography></TableCell>
                <TableCell><Typography variant="body1" fontWeight="bold">Estado</Typography></TableCell>
                <TableCell><Typography variant="body1" fontWeight="bold">Nombre Completo</Typography></TableCell>
                <TableCell><Typography variant="body1" fontWeight="bold">Dirección</Typography></TableCell>
                <TableCell><Typography variant="body1" fontWeight="bold">Teléfono</Typography></TableCell>
                <TableCell><Typography variant="body1" fontWeight="bold">Fecha de Entrega</Typography></TableCell>
                <TableCell><Typography variant="body1" fontWeight="bold">Acciones</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidos.map((pedido, index) => (
                <TableRow key={index}>
                  <TableCell>{pedido.fechaCreacion}</TableCell> 
                  <TableCell>{`Q. ${pedido.totalOrden ? pedido.totalOrden.toFixed(2) : '0.00'}`}</TableCell> 
                  <TableCell>{pedido.estado}</TableCell>
                  <TableCell>{pedido.nombreCompleto}</TableCell>
                  <TableCell>{pedido.direccion}</TableCell>
                  <TableCell>{pedido.telefono}</TableCell>
                  <TableCell>{pedido.fechaEntrega || 'N/A'}</TableCell> 
                  <TableCell>
                    {pedido.idEstado === 1 && (
                      <Button 
                        variant="contained" 
                        color="error" 
                        onClick={() => handleCancelOrder(pedido.idOrden)}
                      >
                        Cancelar Orden
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default ListaOrdenes;
