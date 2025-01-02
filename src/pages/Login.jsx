import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';  // Importa el contexto de autenticación
import LoginForm from '../components/LoginForm.jsx';  // Importa el formulario de login

const Login = () => {
  const { login } = useContext(AuthContext);  // Accedemos a la función de login del contexto
  const navigate = useNavigate(); 
  // Definimos el esquema de validación
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
        contrasena: data.password,
      });

      console.log('Respuesta de la API:', response.data);

      // Si la autenticación es exitosa, actualizamos el contexto
      const token = response.data.token; 
      const role = response.data.role; 
      login(token,role);
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
    <div>
      <LoginForm 
        onSubmit={handleSubmit(onSubmit)} 
        register={register} 
        errors={errors} 
      />
    </div>
  );
};

export default Login;
