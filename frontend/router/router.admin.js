const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();
const multer = require('multer');
const FormData = require('form-data');

const URL_BACKEND = process.env.URL_BACKEND || 'http://localhost:4040';
const upload = multer({ storage: multer.memoryStorage() });


router.get('/admin', async (req, res) => {
    try {
        // Verificar sesión del usuario
        const sessionResponse = await axios.get(`${URL_BACKEND}/login/me`, {
            headers: {
                'api-key-441': process.env.APIKEY_PASS,
                ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {})
            },
            withCredentials: true
        });

        const usuario = sessionResponse.data.usuario;

        // Verificar que el usuario sea administrador
        if (!usuario || (usuario.rol !== 'administrador' && usuario.rol !== 'admin')) {
            return res.redirect('/?error=acceso_denegado');
        }

        // Cargar datos del panel de administrador
        const [resProductos, resUsuarios, resPedidos, resMarcas,resCategorias] = await Promise.all([
            axios.get(`${URL_BACKEND}/productos/admin`, {
                headers: {
                    'api-key-441': process.env.APIKEY_PASS
                }
            }),
            axios.get(`${URL_BACKEND}/usuarios`, {
                headers: {
                    'api-key-441': process.env.APIKEY_PASS
                }
            }),
            axios.get(`${URL_BACKEND}/pedidos`, {
                headers: {
                    'api-key-441': process.env.APIKEY_PASS
                }
            }),
            axios.get(`${URL_BACKEND}/marcas`, {
                headers: {
                    'api-key-441': process.env.APIKEY_PASS
                }
            }),
            axios.get(`${URL_BACKEND}/categorias`, {
                headers: {
                    'api-key-441': process.env.APIKEY_PASS
                }
            }).catch(() => ({ data: { data: [] } })) // Si falla, devolver array vacío
        ]);

        const productos = resProductos.data.data;
        const usuarios = resUsuarios.data.data;
        const pedidos = resPedidos.data.data;
        const marcas = resMarcas.data.data;
        const categorias = resCategorias.data.data

        const stockTotal = productos.reduce((accProducto, producto) => {
            const stockProducto = producto.variante.reduce((accVariante, v) => accVariante + v.stock, 0);
            return accProducto + stockProducto;
        }, 0);
        const ganancias = pedidos.reduce((acc, pedido) => acc + pedido.total, 0);
        res.render('pages/admin', {
            productos,
            usuario: usuarios,
            pedidos,
            marcas,
            categorias,
            usuarioActual: usuario,
            ganancias,
            stockTotal
        });

    } catch (error) {
        console.error("Error cargando datos del admin:", error.message);

        // Si es error de autenticación, redirigir al login
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            return res.redirect('/?error=sesion_expirada');
        }

        res.render('pages/error500', {
            message: 'Se presentó un error al mostrar los elementos del panel de administrador'
        });
    }
});
//Agregar producto 

router.post('/api/admin/productos', upload.single('imagen'), async (req, res) => {
    try {
        // 1. Validar la sesión del administrador
        const sessionResponse = await axios.get(`${URL_BACKEND}/login/me`, {
            headers: {
                'api-key-441': process.env.APIKEY_PASS,
                ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {})
            },
            withCredentials: true
        });

        const usuario = sessionResponse.data.usuario;
        if (!usuario || (usuario.rol !== 'administrador' && usuario.rol !== 'admin')) {
            return res.status(403).json({ success: false, message: 'Acceso denegado. Se requiere ser administrador.' });
        }

        // 2. Reconstruir el FormData para enviarlo al backend
        const form = new FormData();

        // Añadir todos los campos de texto
        for (const key in req.body) {
            form.append(key, req.body[key]);
        }

        // Añadir el archivo si existe
        if (req.file) {
            form.append('imagen', req.file.buffer, {
                filename: req.file.originalname,
                contentType: req.file.mimetype,
            });
        }

        //Enviar la petición al backend
        await axios.post(`${URL_BACKEND}/productos`, form, {
            headers: {
                ...form.getHeaders(), // Importante para multipart/form-data
                'api-key-441': process.env.APIKEY_PASS,
                 ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {})
            },
             withCredentials: true
        });

        res.redirect('/admin#productos')

    } catch (error) {
        console.error('Respuesta del backend:', error.response?.data || error.message);
        console.error('Error en el proxy de creación de producto:', error.message);
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        res.status(500).json({ success: false, message: 'Error interno del servidor en el proxy.' });
    }
});


// Agregar Usuario

router.post('/admin/crearUsuario', async(req,res)=>{
    const {nombre,email,telefono,password,rol,estado}= req.body
    try {
        await axios.post(`${URL_BACKEND}/usuarios`,
            {nombre,email,password,telefono,rol,estado}, {
            headers: {
                'api-key-441': process.env.APIKEY_PASS
            }
        });
        res.redirect('/admin#Usuarios');
    } catch (error) {
        console.error('Error al crear producto:', error.message);
        if (error.response && error.response.data) {
            return res.status(error.response.status).send(error.response.data);
        }
        res.status(500).send('Error interno al crear producto');
    }
})

router.post('/admin/crearCategoria', async(req,res)=>{
    const {nombre,descripcion}=req.body;
    try {
        await axios.post(`${URL_BACKEND}/categorias`,
            {nombre,descripcion}, {
            headers: {
                'api-key-441': process.env.APIKEY_PASS
            }
        });

        res.redirect('/admin#Categorias')
    } catch (error) {
        console.error('Error al crear producto:', error.message);
        if (error.response && error.response.data) {
            return res.status(error.response.status).send(error.response.data);
        }
        res.status(500).send('Error interno al crear producto');
    }
})

router.post('/admin/crearMarcas',async(req,res)=>{
    const {nombre}=req.body;
    try {
        await axios.post(`${URL_BACKEND}/marcas`,
            {nombre}, {
            headers: {
                'api-key-441': process.env.APIKEY_PASS
            }
        });
        res.redirect('/admin#Marcas')
    } catch (error) {
        console.error('Error al crear producto:', error.message);
        if (error.response && error.response.data) {
            return res.status(error.response.status).send(error.response.data);
        }
        res.status(500).send('Error interno al crear producto');
    }
})

router.post('/admin/crearPedido',async(req,res)=>{
    const {idUsuario, fecha, total,estado} = req.body;
    try{
        await axios.post(`${URL_BACKEND}/pedidos`,
            {clienteId: idUsuario,
            fechaCreacion: fecha,
            total,
            estado},{
            headers: {
                'api-key-441': process.env.APIKEY_PASS
            }
        });
        res.redirect('/admin#Pedidos')
    }catch (error) {
        console.error('Error al crear pedido:', error.message);
        if (error.response && error.response.data) {
            return res.status(error.response.status).send(error.response.data);
        }
        res.status(500).send('Error interno al crear pedido');
    }
})

//EDITAR

//MARCA
router.post('/admin/editarMarca/:id', async(req,res)=>{
    const {id}=req.params;
    const {nombre}= req.body;
    try {
        await axios.put(`${URL_BACKEND}/marcas/${id}`,
            {nombre}, {
            headers: {
                'api-key-441': process.env.APIKEY_PASS
            }
        });
        res.redirect('/admin#Marcas')
    } catch (error) {
        console.error("Error al editar producto:", error.message);

        if (error.response && error.response.data) {
            return res
        .status(error.response.status)
        .send(error.response.data);
    }

    res.status(500).send("Error interno al editar producto");
    }
})

//PRODUCTOS
router.post("/admin/editarProducto/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, categoriaId, marcaId, precio, stock, estado} = req.body;
  const visible = req.body.visible==='on'

  try {
    await axios.put(
      `${URL_BACKEND}/productos/${id}`,
      { nombre, descripcion, categoriaId, marcaId, precio, stock, estado, visible },
      {
        headers: {
          "api-key-441": process.env.APIKEY_PASS,
        },
      }
    );

        res.redirect('/admin#productos');

  } catch (error) {
    console.error("Error al editar producto:", error.message);

    if (error.response && error.response.data) {
      return res
        .status(error.response.status)
        .send(error.response.data);
    }

    res.status(500).send("Error interno al editar producto");
  }
});

//CATEGORIAS
router.post('/admin/editarCategoria/:id' ,async(req,res)=>{
    const {id}= req.params;
    const {nombre,descripcion}=req.body;
    try {
        await axios.put(`${URL_BACKEND}/categorias/${id}`,
        { nombre, descripcion },{
            headers:{
                'api-key-441': process.env.APIKEY_PASS
            }
        }
       ) 
    res.redirect('/admin#Categorias');

    } catch (error) {
        console.error("Error al editar producto:", error.message);

        if (error.response && error.response.data) {
            return res
            .status(error.response.status)
            .send(error.response.data);
    }

    res.status(500).send("Error interno al editar producto");
    }
})

router.post('/admin/editarProducto/:id' ,async(req,res)=>{
    const {id }= req.params;
    const { nombre, descripcion, categoriaId, marcaId, precio, stock, estado, visible } = req.body;
    try {
       await axios.put(`${URL_BACKEND}/usuarios/${id}`,
        { nombre, descripcion, categoriaId, marcaId, precio, stock, estado, visible },{
            headers:{
                'api-key-441': process.env.APIKEY_PASS
            }
        }
       )
    res.redirect('/admin#Productos');

    } catch (error) {
        console.error("Error al editar producto:", error.message);

        if (error.response && error.response.data) {
            return res
            .status(error.response.status)
            .send(error.response.data);
    }

    res.status(500).send("Error interno al editar producto");
    }
})

router.post('/admin/editarPedido/:id', async (req, res) => {
    const { id } = req.params;
    const { clienteId, fechaCreacion, total, estado } = req.body;
    try {
        await axios.put(`${URL_BACKEND}/pedidos/${id}`, {
            clienteId,
            fechaCreacion,
            total,
            estado},{
            headers: {
                'api-key-441': process.env.APIKEY_PASS
            }
        });
        res.redirect('/admin#Pedidos');
    } catch (error) {
        console.error('Error al editar pedido:', error.message);
        if (error.response && error.response.data) {
            return res.status(error.response.status).send(error.response.data);
        }
        res.status(500).send('Error interno al editar pedido');
    }
});

//USUARIO
router.post('/admin/editarUsuario/:id',async(req,res)=>{
      const { id } = req.params;
        const {nombre,email,telefono,password,rol,estado}= req.body
    try {
        await axios.put(`${URL_BACKEND}/usuarios/${id}`,
            {nombre,email,password,telefono,rol,estado}, {
            headers: {
                'api-key-441': process.env.APIKEY_PASS
            }
        });

        res.redirect('/admin#Usuarios');
    }catch(error){
    console.error("Error al editar producto:", error.message);

    if (error.response && error.response.data) {
      return res
        .status(error.response.status)
        .send(error.response.data);
    }

    res.status(500).send("Error interno al editar producto");
    }
})

router.delete('/admin/eliminarProducto/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await axios.delete(`${URL_BACKEND}/productos/${id}`, {
            headers: {
                'api-key-441': process.env.APIKEY_PASS
            }
        });
        res.json({ success: true, message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error("Error al eliminar producto:", error.message);
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        res.status(500).json({ success: false, message: 'Error al eliminar producto' });
    }
});

router.delete('/admin/eliminarUsuario/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await axios.delete(`${URL_BACKEND}/usuarios/${id}`, {
            headers: {
                'api-key-441': process.env.APIKEY_PASS
            }
        });
        res.json({ success: true, message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error("Error al eliminar usuario:", error.message);
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        res.status(500).json({ success: false, message: 'Error al eliminar usuario' });
    }
});

router.delete('/admin/eliminarCategoria/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await axios.delete(`${URL_BACKEND}/categorias/${id}`, {
            headers: {
                'api-key-441': process.env.APIKEY_PASS
            }
        });
        res.json({ success: true, message: 'Categoría eliminada correctamente' });
    } catch (error) {
        console.error("Error al eliminar categoría:", error.message);
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        res.status(500).json({ success: false, message: 'Error al eliminar categoría' });
    }
});

router.delete('/admin/eliminarMarca/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await axios.delete(`${URL_BACKEND}/marcas/${id}`, {
            headers: {
                'api-key-441': process.env.APIKEY_PASS
            }
        });
        res.json({ success: true, message: 'Marca eliminada correctamente' });
    } catch (error) {
        console.error("Error al eliminar marca:", error.message);
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        res.status(500).json({ success: false, message: 'Error al eliminar marca' });
    }
});

router.delete('/admin/eliminarPedido/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await axios.delete(`${URL_BACKEND}/pedidos/${id}`, {
            headers: {
                'api-key-441': process.env.APIKEY_PASS
            }
        });
        res.json({ success: true, message: 'Pedido eliminado correctamente' });
    } catch (error) {
        console.error("Error al eliminar pedido:", error.message);
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        res.status(500).json({ success: false, message: 'Error al eliminar pedido' });
    }
});

module.exports = router;
