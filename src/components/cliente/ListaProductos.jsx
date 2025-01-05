import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Grid, Typography, Box } from '@mui/material';
import TarjetaProducto from './TarjetaProducto.jsx';
import { AuthContext } from '../../context/AuthContext';

const ListaProductos = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, role, usuario } = useContext(AuthContext);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!usuario || !token || !role) {
        return;
      }

      try {
        const response = await axios.get('http://localhost:4000/api/productos-stock', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'rolId': role,
          },
          params: {
            idUsuario: usuario,
          },
          responseType: 'json'
        });

        const productsWithImages = response.data.map(product => {
          if (product.foto && Array.isArray(product.foto)) {
            const buffer = new Uint8Array(product.foto);
            const blob = new Blob([buffer], { type: 'image/jpeg' });
            const imageUrl = URL.createObjectURL(blob);
            return {
              ...product,
              foto: imageUrl
            };
          } else {
            return product;
          }
        });

        setProducts(productsWithImages);
      } catch (err) {
        setError(err);
        console.error('Error al obtener productos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [usuario, token, role]);

  if (loading) {
    return <Typography variant="h6">Cargando productos...</Typography>;
  }

  if (error) {
    return <Typography variant="h6">Error al cargar productos: {error.message}</Typography>;
  }

  return (
    <Box sx={{ px: 3, py: 2 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          textShadow: '1px 1px 4px rgba(0, 0, 0, 0.3)', // Sombra de texto para destacar
          marginBottom: '80px', 
        }}
      >
        🎉 Productos disponibles para la compra 🎉
    </Typography>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.idProducto}>
            <TarjetaProducto producto={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ListaProductos;
