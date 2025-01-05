import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx'; 
import LoginForm from '../components/LoginForm.jsx'; 
import { Box, Paper } from '@mui/material'; // Importar Material-UI para diseño

const Login = () => {
  const { login } = useContext(AuthContext);  
  const navigate = useNavigate(); 

  const schema = yup.object().shape({
    correoElectronico: yup
      .string()
      .email("Por favor, ingrese un correo electrónico válido")
      .required("Campo requerido"),
    password: yup.string().required("Campo requerido"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:4000/api/login', {
        correoElectronico: data.correoElectronico,
        contrasena: data.password
      });
      const token = response.data.token; 
      const role = response.data.role; 
      const usuario = response.data.usuario;
      login(token, role, usuario);
      navigate('/home');
    } catch (error) {
      console.error('Error al hacer la petición:', error);
      if (error.response) {
        alert(error.response.data.message || 'Hubo un problema en el login');
      } else {
        alert('Error al conectar con el servidor');
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >

        <LoginForm 
          onSubmit={handleSubmit(onSubmit)} 
          register={register} 
          errors={errors} 
        />
    </Box>
  );
};

export default Login;
