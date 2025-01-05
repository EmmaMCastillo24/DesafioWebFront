import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';

const TarjetaProducto = ({ producto }) => {

  const handleAgregar = () => {
    const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Busca si el producto ya está en el carrito
    const productoExistente = carritoActual.find(item => item.id === producto.idProducto);
  
    if (productoExistente) {
      // Si ya está en el carrito, verifica el stock
      if (productoExistente.cantidad >= productoExistente.stock) {
        // Mostrar alerta si se excede el stock
        Swal.fire({
          icon: 'error',
          title: 'Stock insuficiente',
          text: `No puedes agregar más unidades de ${producto.producto}. Stock disponible: ${productoExistente.stock}.`,
          confirmButtonText: 'Entendido',
          timer: 3000,
        });
        return; // Termina la función
      }
  
      // Incrementa la cantidad si no se supera el stock
      productoExistente.cantidad += 1;
      productoExistente.subtotal = productoExistente.cantidad * productoExistente.precio; // Actualiza el subtotal
    } else {
      // Si el producto no está en el carrito, verifica el stock antes de agregarlo
      if (producto.stock < 1) {
        Swal.fire({
          icon: 'error',
          title: 'Sin stock',
          text: `No hay unidades disponibles de ${producto.producto}.`,
          confirmButtonText: 'Entendido',
          timer: 3000,
        });
        return; // Termina la función
      }
  
      // Agrega el producto al carrito con cantidad inicial de 1 y el stock
      carritoActual.push({
        id: producto.idProducto,
        nombre: producto.producto,
        cantidad: 1,
        stock: producto.stock,  // Guardar el stock
        precio: producto.precio, // Guardar el precio
        subtotal: producto.precio, // El subtotal inicial es igual al precio por la cantidad
      });
    }
  
    // Actualiza el carrito en el localStorage con el stock y subtotales
    localStorage.setItem('carrito', JSON.stringify(carritoActual));
  
    // Mostrar mensaje de éxito
    toast.success(`${producto.producto} agregado al carrito`, {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <>
      <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {producto.foto && (
          <CardMedia
            component="img"
            sx={{
              width: '100%',  // Asegura que la imagen ocupe el ancho completo del contenedor
              height: 150,    // Ajusta la altura para hacerlo más pequeño
              objectFit: 'contain',  // Hace que la imagen se ajuste dentro del contenedor sin recortarse
              marginBottom: '16px',  // Espacio debajo de la imagen (opcional)
            }}
            image={producto.foto}
            alt={producto.producto}
          />
        )}
        <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ marginBottom: '8px' }}>{producto.producto}</Typography>
          
          {/* Fila con stock y precio */}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Typography variant="body2">Stock: {producto.stock}</Typography>
            <Typography variant="h6">Q. {producto.precio.toFixed(2)}</Typography> 
          </div>
          
        </CardContent>
        
        {/* Botón para agregar al carrito */}
        <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, margin: '0 auto', mb:2 }} 
        onClick={handleAgregar}
        >
          Añadir al carrito
        </Button>
      </Card>
      <ToastContainer />
    </>
  );
};

export default TarjetaProducto;
