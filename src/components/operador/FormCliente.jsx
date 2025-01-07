import React, { useState, useEffect, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import Swal from "sweetalert2"; // Importar SweetAlert2
import { TextField, Button, Grid, Typography, Container, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper } from "@mui/material";
import { AuthContext } from '../../context/AuthContext.jsx';

const FormCliente = () => {
  const schema = yup.object().shape({
    razonSocial: yup.string().required("Campo obligatorio"),
    nombreComercial: yup.string().required("Campo obligatorio"),
    direccionEntrega: yup.string().required("Campo obligatorio"),
    telefono: yup
      .string()
      .matches(/^\d{8}$/, "El teléfono debe ser un número de 8 dígitos")
      .required("Campo obligatorio"),
    correoElectronico: yup
      .string()
      .email("El correo electrónico no es válido")
      .required("Campo obligatorio"),
  });

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, role, usuario } = useContext(AuthContext);
  const [page, setPage] = useState(0); // Página actual
  const [rowsPerPage, setRowsPerPage] = useState(5); // Filas por página
  const [selectedClient, setSelectedClient] = useState(null); // Cliente seleccionado para edición

  const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  // Cargar clientes desde la API
  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/clientes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'rolId': role,
        },
        params: {
          idUsuario: usuario,
        },
        responseType: 'json'
      });
      setClientes(response.data.data);
    } catch (error) {
      console.error("Error al obtener los clientes", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Manejar el submit del formulario
  const onSubmit = async (data) => {
    try {
      setLoading(true);
  
      // Si hay un cliente seleccionado, actualizamos
      if (selectedClient) {
        const response = await axios.put("http://localhost:4000/api/cliente", {
          idUsuario: usuario,
          ...data,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'rolId': role,
          },
          responseType: 'json',
        });
  
        if (response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Cliente actualizado',
            text: 'El cliente ha sido actualizado con éxito.',
            confirmButtonText: 'Entendido',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar el cliente. Intenta nuevamente.',
            confirmButtonText: 'Entendido',
          });
        }
      } else {
        // Si no hay cliente seleccionado, insertamos uno nuevo
        const response = await axios.post("http://localhost:4000/api/cliente", {
          idUsuario: usuario,
          ...data,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'rolId': role,
          },
          responseType: 'json',
        });
  
        if (response.status === 201) {
          Swal.fire({
            icon: 'success',
            title: 'Cliente insertado',
            text: 'El cliente ha sido insertado con éxito.',
            confirmButtonText: 'Entendido',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al insertar el cliente. Intenta nuevamente.',
            confirmButtonText: 'Entendido',
          });
        }
      }
  
      fetchClients(); // Recargar la lista de clientes
      reset(); // Limpiar el formulario después de guardar
      setSelectedClient(null); // Limpiar cliente seleccionado después de guardar
    } catch (error) {
      console.error("Error al registrar o actualizar el cliente", error);
      const errorMessage = error.response?.data?.message || error.message || 'Hubo un error inesperado.';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonText: 'Entendido',
      });
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Manejar el cambio de número de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Resetear a la primera página al cambiar el número de filas por página
  };

  // Obtener los clientes a mostrar en la página actual
  const paginatedClients = clientes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Activar o inactivar cliente
  const toggleClientStatus = async (idCliente, currentStatus) => {
    try {
      const newStatus = currentStatus === 2 ? 1 : 2; // Cambiar de estado (2 -> inactivar, 1 -> activar)
      const response = await fetch('http://localhost:4000/api/clientes', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'rolId': role,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idCliente: idCliente,
          idEstado: newStatus,
          idUsuario: usuario
        }),
      });

      if (response.status === 201) {
        // Mostrar SweetAlert de éxito
        Swal.fire({
          icon: 'success',
          title: newStatus === 2 ? 'Cliente inactivado' : 'Cliente activado',
          text: newStatus === 2 ? 'El cliente ha sido inactivado correctamente.' : 'El cliente ha sido activado correctamente.',
        });
        fetchClients(); // Recargar la lista de clientes
      }
    } catch (error) {
      console.error("Error al modificar el estado del cliente", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al modificar el estado del cliente.',
      });
    }
  };

  // Seleccionar un cliente para editar
  const handleEdit = (cliente) => {
    setSelectedClient(cliente);
    Object.keys(cliente).forEach((key) => {
      setValue(key, cliente[key]);
    });
  };
  

  return (
    <Container>
      <Card elevation={3} sx={{ marginBottom: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {selectedClient ? 'Editar Cliente' : 'Registro de Clientes'}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="razonSocial"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Razón Social"
                    fullWidth
                    error={!!errors.razonSocial}
                    helperText={errors.razonSocial?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="nombreComercial"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre Comercial"
                    fullWidth
                    error={!!errors.nombreComercial}
                    helperText={errors.nombreComercial?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="direccionEntrega"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Dirección de Entrega"
                    fullWidth
                    error={!!errors.direccionEntrega}
                    helperText={errors.direccionEntrega?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="telefono"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Teléfono"
                    fullWidth
                    error={!!errors.telefono}
                    helperText={errors.telefono?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="correoElectronico"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Correo Electrónico"
                    fullWidth
                    error={!!errors.correoElectronico}
                    helperText={errors.correoElectronico?.message}
                  />
                )}
              />
            </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Guardando..." : selectedClient ? "Actualizar" : "Guardar"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Card elevation={3} sx={{ marginBottom: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Lista de Clientes
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Razón Social</TableCell>
                  <TableCell>Nombre Comercial</TableCell>
                  <TableCell>Dirección de Entrega</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Correo Electrónico</TableCell>
                  <TableCell>Acciones</TableCell> {/* Columna de acciones */}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedClients.map((cliente) => (
                  <TableRow key={cliente.idCliente}>
                    <TableCell>{cliente.razonSocial}</TableCell>
                    <TableCell>{cliente.nombreComercial}</TableCell>
                    <TableCell>{cliente.direccionEntrega}</TableCell>
                    <TableCell>{cliente.telefono}</TableCell>
                    <TableCell>{cliente.correoElectronico}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit(cliente)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color={cliente.idEstado === 2 ? "success" : "error"} 
                        onClick={() => toggleClientStatus(cliente.idCliente, cliente.idEstado)}
                      >
                        {cliente.idEstado === 2 ? "Activar" : "Inactivar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginación */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={clientes.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>
    </Container>
  );
};
export default FormCliente;
