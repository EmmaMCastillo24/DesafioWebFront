import React, { useContext } from 'react';
import { Box, Typography } from '@mui/material';

const NotFoundPage = () => {

  return (
    <div>
      <Box 
        display="flex" 
        justifyContent="center" 
        width="100%"
        padding={2}
      >
        <Typography variant="h3">
          Pagina no encontrada
        </Typography>
      </Box>
    
    </div>
  );
};

export default NotFoundPage;
