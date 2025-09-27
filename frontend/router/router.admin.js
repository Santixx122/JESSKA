const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const URL_BACKEND = process.env.URL_BACKEND || 'http://localhost:4040';

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
            axios.get(`${URL_BACKEND}/productos`, {
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

        res.render('pages/admin', {
            productos,
            usuario: usuarios,
            pedidos,
            marcas,
            categorias,
            usuarioActual: usuario
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

router.post('/admin/crearProducto', async (req, res) => {

    console.log("Datos recibidos del formulario:", req.body);
    const { nombre, categoriaId, marcaId, color, descripcion, talla, precio, stock, estado} = req.body
    const visible = req.body.visible==='on'
    try {
        await axios.post(`${URL_BACKEND}/productos`,
            { nombre, categoriaId, marcaId, color, descripcion, talla, precio, stock, estado, visible }, {
            headers: {
                'api-key-441': process.env.APIKEY_PASS
            }
        });
        res.redirect('/admin#productos');
    } catch (error) {
        console.error('Error al crear producto:', error.message);
        if (error.response && error.response.data) {
            return res.status(error.response.status).send(error.response.data);
        }
        res.status(500).send('Error interno al crear producto');
    }
})


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

module.exports = router;
