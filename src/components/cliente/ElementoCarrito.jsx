import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

const ElementoCarrito = () => {
  const cartItems = [
    { id: 1, name: 'Producto A', price: 100, quantity: 2 },
  ];

  return (
    <div>
      {cartItems.map((item) => (
        <Card key={item.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{item.name}</Typography>
            <Typography variant="body2">Precio: ${item.price}</Typography>
            <Typography variant="body2">Cantidad: {item.quantity}</Typography>
            <Button variant="contained" color="secondary" sx={{ mt: 1 }}>
              Eliminar
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ElementoCarrito;