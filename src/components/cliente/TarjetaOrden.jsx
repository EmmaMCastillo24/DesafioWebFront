import React, { useEffect, useState, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TextField, Typography, Box, Grid, Card, CardContent } from '@mui/material';
import { Remove, Add, Delete } from '@mui/icons-material';
import Swal from 'sweetalert2';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../context/AuthContext';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  correoElectronico: yup.string().email("Por favor, ingrese un correo electrónico válido").required("Campo requerido"),
  nombreCompleto: yup.string().required("Campo requerido"),
  direccion: yup.string().required("Campo requerido"),
  telefono: yup.string().matches(/^\d{8}$/, "Debe ser un número de 8 dígitos").required("Campo requerido"),
  fechaEntrega: yup.date().required("Campo requerido"),
});

const TarjetaOrden = () => {
  const { token, role, usuario } = useContext(AuthContext);
  const [productosEnCarrito, setProductosEnCarrito] = useState([]);

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombreCompleto: '',
      direccion: '',
      telefono: '',
      correoElectronico: '',
      fechaEntrega: '',
    },
  });

  useEffect(() => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    setProductosEnCarrito(carrito);
  }, []);

  // Calcular el total de la compra
  const calcularTotal = () => {
    return productosEnCarrito.reduce((total, producto) => {
      return total + producto.precio * producto.cantidad;
    }, 0);
  };

  const confirmarPedido = async (data) => {
    if (productosEnCarrito.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Carrito vacío',
        text: 'No tienes productos en el carrito para confirmar.',
        confirmButtonText: 'Entendido',
      });
      return;
    }

    const pedido = productosEnCarrito.map(producto => ({
      idProducto: producto.id,
      cantidad: producto.cantidad,
      precio: producto.precio,
    }));

    try {
      const response = await axios.post('http://localhost:4000/api/orden',
        {
          idUsuario: usuario,
          idEstado: 1,
          fechaCreacion: new Date().toLocaleDateString(),
          ...data,
          totalOrden: calcularTotal(),
          detallesOrden: pedido,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'rolId': role,
          },
          responseType: 'json',
        }
      );
      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Pedido confirmado',
          text: 'Tu pedido ha sido confirmado con éxito.',
          confirmButtonText: 'Entendido',
        });

        localStorage.removeItem('carrito');
        setProductosEnCarrito([]);
        reset();
        
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al confirmar el pedido',
          text: 'Hubo un problema al procesar tu pedido. Intenta nuevamente.',
          confirmButtonText: 'Entendido',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al confirmar el pedido. Intenta nuevamente.',
        confirmButtonText: 'Entendido',
      });
    }
  };

  const disminuirCantidad = (producto) => {
    const newProductos = productosEnCarrito.map((prod) => {
      if (prod.id === producto.id) {
        const nuevaCantidad = prod.cantidad - 1;
        return { ...prod, cantidad: nuevaCantidad > 0 ? nuevaCantidad : 0, subtotal: (nuevaCantidad > 0 ? nuevaCantidad : 0) * prod.precio };
      }
      return prod;
    }).filter(prod => prod.cantidad > 0);
  
    setProductosEnCarrito(newProductos);
    localStorage.setItem('carrito', JSON.stringify(newProductos));
  };
  
  const incrementarCantidad = (producto) => {
    const newProductos = productosEnCarrito.map((prod) => {
      if (prod.id === producto.id) {
        const nuevaCantidad = prod.cantidad + 1;
        return { ...prod, cantidad: nuevaCantidad, subtotal: nuevaCantidad * prod.precio };
      }
      return prod;
    });
  
    setProductosEnCarrito(newProductos);
    localStorage.setItem('carrito', JSON.stringify(newProductos));
  };

  const eliminarProducto = (id) => {
    const newProductos = productosEnCarrito.filter(producto => producto.id !== id);
    setProductosEnCarrito(newProductos);
    localStorage.setItem('carrito', JSON.stringify(newProductos));
  };

  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      <Grid item xs={12} md={6}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Información del Usuario
            </Typography>
            <form onSubmit={handleSubmit(confirmarPedido)}>
              <Controller
                name="nombreCompleto"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre Completo"
                    fullWidth
                    margin="normal"
                    error={!!errors.nombreCompleto}
                    helperText={errors.nombreCompleto?.message}
                  />
                )}
              />
              <Controller
                name="direccion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Dirección"
                    fullWidth
                    margin="normal"
                    error={!!errors.direccion}
                    helperText={errors.direccion?.message}
                  />
                )}
              />
              <Controller
                name="telefono"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Teléfono"
                    fullWidth
                    margin="normal"
                    error={!!errors.telefono}
                    helperText={errors.telefono?.message}
                  />
                )}
              />
              <Controller
                name="correoElectronico"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Correo Electrónico"
                    fullWidth
                    margin="normal"
                    error={!!errors.correoElectronico}
                    helperText={errors.correoElectronico?.message}
                  />
                )}
              />
              <Controller
                name="fechaEntrega"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Fecha de Entrega"
                    type="date"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!errors.fechaEntrega}
                    helperText={errors.fechaEntrega?.message}
                  />
                )}
              />
              <Button
                type="submit"
                variant="contained"
                color="success"
                fullWidth
                sx={{ marginTop: 2 }}
              >
                Confirmar Pedido
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h5" gutterBottom paddingBottom={2}>
              Carrito de Compras
            </Typography>
            {productosEnCarrito.length === 0 ? (
              <Typography variant="h6">Tu carrito está vacío.</Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">Producto</Typography>
                      </TableCell>
                      <TableCell>
                      <Typography variant="body1" fontWeight="bold">Cantidad</Typography>
                      </TableCell>
                      <TableCell>
                      <Typography variant="body1" fontWeight="bold">Subtotal</Typography>                      
                      </TableCell>
                      <TableCell>
                      <Typography variant="body1" fontWeight="bold">Acciones</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productosEnCarrito.map((producto) => (
                      <TableRow key={producto.id}>
                        <TableCell>{producto.nombre}</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <IconButton onClick={() => disminuirCantidad(producto)} color="primary" size="small">
                              <Remove />
                            </IconButton>
                            <TextField
                              value={producto.cantidad}
                              onChange={(e) => e.preventDefault()}
                              type="number"
                              InputProps={{ readOnly: true }}
                              sx={{ width: '60px', textAlign: 'center', marginRight: 1 }}
                            />
                            <IconButton onClick={() => incrementarCantidad(producto)} color="primary" size="small">
                              <Add />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>{` ${producto.subtotal.toLocaleString('es-GT', { style: 'currency', currency: 'GTQ' })}`}</TableCell>
                        <TableCell>
                            <Button 
                                  variant="contained" 
                                  color="error" 
                                    onClick={() => eliminarProducto(producto.id)}
                            >
                              Eliminar
                            </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
        <Card elevation={3} sx={{ marginTop: 2 }}>
        <CardContent sx={{ textAlign: 'right' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Total: Q. {calcularTotal().toFixed(2)}
          </Typography>
        </CardContent>
        </Card>
      </Grid>
      <ToastContainer />
    </Grid>
  );
};

export default TarjetaOrden;
