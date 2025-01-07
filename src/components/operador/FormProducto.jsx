import React, { useState, useEffect, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import Swal from "sweetalert2"; 
import { TextField, Button, Grid, Typography, Container, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { AuthContext } from '../../context/AuthContext.jsx';

const FormProducto = () => {
  const schema = yup.object().shape({
    idCategoria: yup.string().required("Campo obligatorio"),
    idMarca: yup.string().required("Campo obligatorio"),
    codigo: yup.string().required("Campo obligatorio"),
    stock: yup.number().required("Campo obligatorio").min(0, "El stock no puede ser negativo"),
    existenciaMinima: yup.number().required("Campo obligatorio").min(0, "La existencia mínima no puede ser negativa"),
    precio: yup.number().required("Campo obligatorio").min(0, "El precio no puede ser negativo"),
    foto: yup.mixed().required("Campo obligatorio"),
    producto: yup.string().required("Campo obligatorio"),
  });

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, role, usuario } = useContext(AuthContext);
  const [page, setPage] = useState(0); // Página actual
  const [rowsPerPage, setRowsPerPage] = useState(5); // Filas por página
  const [selectedProduct, setSelectedProduct] = useState(null); // Producto seleccionado para edición
  const [previewImage, setPreviewImage] = useState(null); 
  const [foto, setFoto] = useState(null); // Para almacenar el archivo de la foto

  const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  // Cargar productos desde la API
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/productos', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'rolId': role,
        },
        params: {
          idUsuario: usuario,
        },
        responseType: 'json'
      });
      setProductos(response.data.data);
    } catch (error) {
      console.error("Error al obtener los productos", error);
    }
  };

  // Cargar categorías y marcas
  const fetchCategoriesAndBrands = async () => {
    try {
      const [categoriasResponse, marcasResponse] = await Promise.all([
        axios.get('http://localhost:4000/api/categoriaProductos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'rolId': role,
          },
        }),
        axios.get('http://localhost:4000/api/marcas', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'rolId': role,
          },
        }),
      ]);
      setCategorias(categoriasResponse.data.data);
      setMarcas(marcasResponse.data.data);
    } catch (error) {
      console.error("Error al obtener categorías o marcas", error);
    }
  };

  useEffect(() => {
    fetchCategoriesAndBrands();
    fetchProducts();
  }, []);

  // Manejar el submit del formulario
  const onSubmit = async (data) => {
    try {
      setLoading(true);
  
      const formData = new FormData();
      formData.append("idUsuario", usuario);
      formData.append("idCategoria", data.idCategoria);
      formData.append("idMarca", data.idMarca);
      formData.append("codigo", data.codigo);
      formData.append("stock", data.stock);
      formData.append("existenciaMinima", data.existenciaMinima);
      formData.append("precio", data.precio);
      formData.append("foto", data.foto[0]); // Suponiendo que el archivo se carga en el array `data.foto`
      formData.append("producto", data.producto);
      if (foto) {
        formData.append("foto", foto);  // 'foto' es el nombre del campo que espera el backend
      }
      // Si hay un producto seleccionado, actualizamos
      if (selectedProduct) {
        formData.append("idProducto", selectedProduct.idProducto);
        const response = await axios.put("http://localhost:4000/api/productos", {
          idUsuario: usuario,
          ...data,
         },{ headers: {
            'Authorization': `Bearer ${token}`,
            'rolId': role
          },
          responseType: 'json',
        });
  
        if (response.status === 201) {
          Swal.fire({
            icon: 'success',
            title: 'Producto actualizado',
            text: 'El producto ha sido actualizado con éxito.',
          });
        }
      } else {
        // Si no hay producto seleccionado, insertamos uno nuevo
        const response = await axios.post("http://localhost:4000/api/productos", formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'rolId': role,
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (response.status === 201) {
          Swal.fire({
            icon: 'success',
            title: 'Producto insertado',
            text: 'El producto ha sido insertado con éxito.',
          });
        }
      }
  
      fetchProducts(); // Recargar la lista de productos
      reset(); // Limpiar el formulario después de guardar
      setPreviewImage(null);
      setFoto(null);
      setSelectedProduct(null); // Limpiar producto seleccionado después de guardar
    } catch (error) {
      console.error("Error al registrar o actualizar el producto", error);
      const errorMessage = error.response?.data?.message || error.message || 'Hubo un error inesperado.';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
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

  // Obtener los productos a mostrar en la página actual
  const paginatedProducts = productos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Activar o inactivar producto
  const toggleProductStatus = async (idProducto, currentStatus) => {
    try {
      const newStatus = currentStatus === 2 ? 1 : 2; // Cambiar de estado (2 -> inactivar, 1 -> activar)
      const response = await fetch('http://localhost:4000/api/productos', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'rolId': role,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idProducto: idProducto,
          idEstado: newStatus,
          idUsuario: usuario
        }),
      });

      if (response.status === 201) {
        // Mostrar SweetAlert de éxito
        Swal.fire({
          icon: 'success',
          title: newStatus === 2 ? 'Producto inactivado' : 'Producto activado',
          text: newStatus === 2 ? 'El producto ha sido inactivado correctamente.' : 'El producto ha sido activado correctamente.',
        });
        fetchProducts(); // Recargar la lista de productos
      }
    } catch (error) {
      console.error("Error al modificar el estado del producto", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al modificar el estado del producto.',
      });
    }
  };

  // Seleccionar un producto para editar
  const handleEdit = (producto) => {
    setSelectedProduct(producto);
    
    // Setear el valor para cada campo
    setValue("producto", producto.producto);
    setValue("codigo", producto.codigo);
    setValue("stock", producto.stock);
    setValue("existenciaMinima", producto.existenciaMinima);
    setValue("precio", producto.precio);
    setValue("foto", producto.foto); // Si la foto está en el producto, ajústalo
  
    // Asegúrate de asignar correctamente las categorías y marcas
    setValue("idCategoria", producto.idCategoria);  // Asegúrate de que este es el ID correcto
    setValue("idMarca", producto.idMarca);  // Lo mismo para el ID de marca
  };
  

  return (
    <Container>
      <Card elevation={3} sx={{ marginBottom: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {selectedProduct ? 'Editar Producto' : 'Registro de Productos'}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                <Controller
                    name="producto"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                    <TextField
                        {...field}
                        label="Nombre Producto"
                        fullWidth
                        error={!!errors.producto}
                        helperText={errors.producto?.message}
                    />
                    )}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.idCategoria}>
                <InputLabel id="categoria-label">Categoría</InputLabel>
                <Controller
                  name="idCategoria"
                  control={control}
                  defaultValue="" 
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="categoria-label"
                      label="Categoría"
                    >
                      {categorias.map((categoria) => (
                        <MenuItem key={categoria.idCategoria} value={categoria.idCategoria}>
                          {categoria.nombreCategoria}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.idCategoria && <p>{errors.idCategoria.message}</p>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.idMarca}>
                    <InputLabel id="marca-label">Marca</InputLabel>
                    <Controller
                    name="idMarca"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <Select
                        {...field}
                        labelId="marca-label"
                        label="Marca"
                        >
                        {marcas.map((marca) => (
                            <MenuItem key={marca.idMarca} value={marca.idMarca}>
                            {marca.nombreMarca}
                            </MenuItem>
                        ))}
                        </Select>
                    )}
                    />
                    {errors.idMarca && <p>{errors.idMarca.message}</p>}
                </FormControl>
            </Grid>


            <Grid item xs={12}>
                <Controller
                    name="codigo"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                    <TextField
                        {...field}
                        label="Código"
                        fullWidth
                        error={!!errors.codigo}
                        helperText={errors.codigo?.message}
                    />
                    )}
                />
            </Grid>


            <Grid item xs={12} sm={6}>
                <Controller
                    name="stock"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                    <TextField
                        {...field}
                        label="Stock"
                        fullWidth
                        type="number"
                        error={!!errors.stock}
                        helperText={errors.stock?.message}
                    />
                    )}
                />
            </Grid>

            <Grid item xs={12} sm={6}>
            <Controller
                name="existenciaMinima"
                control={control}
                defaultValue=""
                render={({ field }) => (
                <TextField
                    {...field}
                    label="Existencia Mínima"
                    fullWidth
                    type="number"
                    error={!!errors.existenciaMinima}
                    helperText={errors.existenciaMinima?.message}
                />
                )}
            />
            </Grid>

            <Grid item xs={12} sm={6}>
            <Controller
                name="precio"
                control={control}
                defaultValue=""
                render={({ field }) => (
                <TextField
                    {...field}
                    label="Precio"
                    fullWidth
                    type="number"
                    error={!!errors.precio}
                    helperText={errors.precio?.message}
                />
                )}
            />
            </Grid>


            <Grid item xs={12} sm={6}>
              <Controller
                name="foto"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setValue("foto", file);  // Actualizamos el valor en react-hook-form
                        setFoto(file); // Guardamos el archivo en el estado
                        setPreviewImage(URL.createObjectURL(file)); // Vista previa
                      }}
                      style={{ width: "100%", padding: "10px 0" }}
                    />
                    {errors.foto && <p>{errors.foto.message}</p>}
                    {previewImage && (
                      <img
                        src={previewImage}
                        alt="Vista previa"
                        style={{ width: "100px", height: "100px", marginTop: "10px" }}
                      />
                    )}
                  </>
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
                  {loading ? "Guardando..." : selectedProduct ? "Actualizar" : "Guardar"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Card elevation={3} sx={{ marginBottom: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Lista de Productos
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre Producto</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Marca</TableCell>
                  <TableCell>Código</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Existencia Mínima</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Acciones</TableCell> {/* Columna de acciones */}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProducts.map((producto) => (
                  <TableRow key={producto.idProducto}>
                    <TableCell>{producto.producto}</TableCell>
                    <TableCell>{producto.nombreCategoria}</TableCell>
                    <TableCell>{producto.nombreMarca}</TableCell>
                    <TableCell>{producto.codigo}</TableCell>
                    <TableCell>{producto.stock}</TableCell>
                    <TableCell>{producto.existenciaMinima}</TableCell>
                    <TableCell>{producto.precio}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit(producto)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color={producto.idEstado === 2 ? "success" : "error"}
                        onClick={() => toggleProductStatus(producto.idProducto, producto.idEstado)}
                      >
                        {producto.idEstado === 2 ? "Activar" : "Inactivar"}
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
            count={productos.length}
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

export default FormProducto;
