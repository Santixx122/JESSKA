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
        const [resProductos, resUsuarios, resPedidos, resAdministradores] = await Promise.all([
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
            axios.get(`${URL_BACKEND}/admin/administradores`, {
                headers: {
                    'api-key-441': process.env.APIKEY_PASS
                }
            }).catch(() => ({ data: { data: [] } })) // Si falla, devolver array vacío
        ]);

        const productos = resProductos.data.data;
        const usuarios = resUsuarios.data.data;
        const pedidos = resPedidos.data.data;
        const administradores = resAdministradores.data.data;

        res.render('pages/admin', { 
            productos, 
            usuario: usuarios, 
            pedidos, 
            administradores,
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

// Ruta para crear administradores
router.post('/api/admin/administradores', async (req, res) => {
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
            return res.status(403).json({ 
                success: false, 
                message: 'Acceso denegado. Solo administradores pueden crear otros administradores.' 
            });
        }

        // Crear el administrador
        const response = await axios.post(`${URL_BACKEND}/admin/administradores`, req.body, {
            headers: {
                'api-key-441': process.env.APIKEY_PASS
            }
        });

        res.json(response.data);

    } catch (error) {
        console.error('Error creando administrador:', error.message);
        
        if (error.response && error.response.data) {
            return res.status(error.response.status).json(error.response.data);
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
});

// Ruta para crear productos
router.post('/api/admin/productos', async (req, res) => {
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
            return res.status(403).json({ 
                success: false, 
                message: 'Acceso denegado. Solo administradores pueden crear productos.' 
            });
        }

        // Crear el producto
        const response = await axios.post(`${URL_BACKEND}/productos`, req.body, {
            headers: {
                'api-key-441': process.env.APIKEY_PASS
            }
        });

        res.json(response.data);

    } catch (error) {
        console.error('Error creando producto:', error.message);
        
        if (error.response && error.response.data) {
            return res.status(error.response.status).json(error.response.data);
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
});

// Ruta para cambiar visibilidad de productos
router.patch('/api/admin/productos/:id/toggle-visibility', async (req, res) => {
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
            return res.status(403).json({ 
                success: false, 
                message: 'Acceso denegado. Solo administradores pueden modificar productos.' 
            });
        }

        // Cambiar visibilidad del producto
        const response = await axios.patch(`${URL_BACKEND}/productos/${req.params.id}/toggle-visibility`, {}, {
            headers: {
                'api-key-441': process.env.APIKEY_PASS
            }
        });

        res.json(response.data);

    } catch (error) {
        console.error('Error cambiando visibilidad del producto:', error.message);
        
        if (error.response && error.response.data) {
            return res.status(error.response.status).json(error.response.data);
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
});

// Ruta para obtener categorías
router.get('/api/admin/categorias', async (req, res) => {
    try {
        const response = await axios.get(`${URL_BACKEND}/categorias`, {
            headers: {
                'api-key-441': process.env.APIKEY_PASS
            }
        });

        res.json(response.data);

    } catch (error) {
        console.error('Error obteniendo categorías:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
});

// Ruta para obtener marcas
router.get('/api/admin/marcas', async (req, res) => {
    try {
        const response = await axios.get(`${URL_BACKEND}/marcas`, {
            headers: {
                'api-key-441': process.env.APIKEY_PASS
            }
        });

        res.json(response.data);

    } catch (error) {
        console.error('Error obteniendo marcas:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
});

// Ruta para obtener productos visibles (para el catálogo)
router.get('/api/productos/visibles', async (req, res) => {
    try {
        const response = await axios.get(`${URL_BACKEND}/productos/visibles`, {
            headers: {
                'api-key-441': process.env.APIKEY_PASS
            }
        });

        res.json(response.data);

    } catch (error) {
        console.error('Error obteniendo productos visibles:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
});

module.exports = router;
