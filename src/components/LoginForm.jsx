import { TextField, Button, Box, Alert, Typography } from '@mui/material';

const LoginForm = ({ onSubmit, register, errors }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: 'white',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Iniciar sesión
      </Typography>

      <form noValidate onSubmit={onSubmit} style={{ width: '100%' }}>
        {/* Campo de correo electrónico */}
        <TextField
          label="Correo electrónico"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          {...register("correoElectronico")}
        />
        {errors.correoElectronico?.message && (
          <Alert severity="error">{errors.correoElectronico.message}</Alert>
        )}

        {/* Campo de contraseña */}
        <TextField
          label="Contraseña"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          {...register("password")}
        />
        {errors.password?.message && (
          <Alert severity="error">{errors.password.message}</Alert>
        )}

        {/* Botón de login */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Iniciar sesión
        </Button>
      </form>
    </Box>
  );
};

export default LoginForm;
