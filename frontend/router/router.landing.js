const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

axios.defaults.withCredentials = true;

const URL_BACKEND = process.env.URL_BACKEND || 'http://localhost:4040';

router.get('/', async (req, res) => {
    try {
        // Get user session
        const respuesta = await axios.get(`${URL_BACKEND}/login/me`, {
            headers: { 
                'api-key-441': process.env.APIKEY_PASS,
                // reenviar cookies del navegador al backend para validar sesión
                ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {})
            },
            withCredentials: true
        });
        const usuario = respuesta.data.usuario;

        res.render('pages/landing', { 
            usuario
        });

    } catch (error) {
        // Manejar mensajes de error desde query parameters
        let errorMessage = null;
        if (req.query.error === 'acceso_denegado') {
            errorMessage = 'Acceso denegado. No tienes permisos para acceder al panel de administrador.';
        } else if (req.query.error === 'sesion_expirada') {
            errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
        }

        res.render('pages/landing', { 
            usuario: null,
            productosDestacados: [],
            error: errorMessage,
            errorField: errorMessage ? 'general' : null
        });
    }
});

// Rutas de perfil movidas a frontend/router/router.perfil.js

// Página del carrito de compras
router.get('/carrito', async (req, res) => {
    try {
        const respuesta = await axios.get(`${URL_BACKEND}/login/me`, {
            headers: { 
                'api-key-441': process.env.APIKEY_PASS,
                ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {})
            },
            withCredentials: true
        });

        const usuario = respuesta.data.usuario;
        res.render('pages/carrito', { usuario });

    } catch (error) {
        res.render('pages/carrito', { usuario: null });
    }
});

// Página del catálogo
router.get('/catalogo', async (req, res) => {
    try {
        // Obtener sesión del usuario
        let usuario = null;
        try {
            const respuesta = await axios.get(`${URL_BACKEND}/login/me`, {
                headers: { 
                    'api-key-441': process.env.APIKEY_PASS,
                    ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {})
                },
                withCredentials: true
            });
            usuario = respuesta.data.usuario;
        } catch (userError) {
            // Usuario no autenticado, continuar sin usuario
        }

        // Obtener productos 
        let productos = [];
        try {
            const productosResponse = await axios.get(`${URL_BACKEND}/productos?showAll=true`, {
                headers: { 'api-key-441': process.env.APIKEY_PASS }
            });
            productos = productosResponse.data.data || [];
        } catch (productosError) {
            console.error('Error cargando productos:', productosError.message);
        }

        res.render('pages/catalogo', { usuario, productos });

    } catch (error) {
        console.error('Error en catálogo:', error.message);
        res.render('pages/catalogo', { usuario: null, productos: [] });
    }
});

router.post('/register', async (req, res) => {
    const { nombre, email, telefono, password } = req.body;
    try {
        await axios.post(`${URL_BACKEND}/usuarios`, 
            { nombre, email, password, telefono }, 
            { 
                headers: { 'api-key-441': process.env.APIKEY_PASS },
                withCredentials: true
            }
        );

        // Registro exitoso: mostrar mensaje en landing
        res.render('pages/landing', { usuario: null, successRegister: 'Registro exitoso. Ahora puedes iniciar sesión.' });
    } catch (error) {
        console.error('Error en registro:', error.message);
        let errorMessage = 'Error al registrar usuario';
        let errorField = 'general';
        if (error.response && error.response.data) {
            errorMessage = error.response.data.message || errorMessage;
            errorField = error.response.data.field || errorField;
        }
        res.render('pages/landing', { 
            usuario: null,
            errorRegister: errorMessage,
            errorRegisterField: errorField,
            regFormData: { nombre, email, telefono }
        });
    }
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const loginResponse = await axios.post(`${URL_BACKEND}/login`,
      { email, password },
      { headers: { 'api-key-441': process.env.APIKEY_PASS }, withCredentials: true }
    );

    const setCookieHeader = loginResponse.headers['set-cookie'];

    if (setCookieHeader) {
      res.setHeader('Set-Cookie', setCookieHeader);
    }

    const usuario = loginResponse.data.usuario || null;
    const redirectToAdmin = loginResponse.data.redirectToAdmin || false;

    // Si el usuario es administrador, redirigir al panel de administrador
    if (redirectToAdmin) {
      return res.redirect('/admin');
    }

    // Si es usuario normal, mostrar landing con mensaje de éxito
    res.render('pages/landing', { usuario, success: 'Inicio de sesión exitoso' });

  } catch (error) {
    console.error('Error en login:', error.message);
    
    let errorMessage = 'Error al iniciar sesión';
    let errorField = 'general';
    
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
      errorField = error.response.data.field || errorField;
    }
    
    res.render('pages/landing', { 
      usuario: null,
      error: errorMessage,
      errorField: errorField,
      formData: { email, password: '' } // Mantener email pero limpiar password
    });
  }
});

// Ruta para logout
router.post('/logout', async (req, res) => {
  try {
    await axios.post(`${URL_BACKEND}/login/logout`, {}, {
      headers: { 
        'api-key-441': process.env.APIKEY_PASS,
        // reenviar cookies actuales para que el backend pueda limpiarlas correctamente
        ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {})
      },
      withCredentials: true
    });

    res.clearCookie('access_token');
    res.redirect('/');
  } catch (error) {
    console.error('Error en logout:', error.message);
    res.redirect('/');
  }
});


router.get('/producto/:id', async (req, res) => {
  const id = req.params.id;
  let usuario = null;

  try {
    // intentar obtener sesión del usuario (si existe)
    try {
      const meResp = await axios.get(`${URL_BACKEND}/login/me`, {
        headers: {
          'api-key-441': process.env.APIKEY_PASS,
          ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {})
        },
        withCredentials: true
      });
      usuario = meResp.data.usuario;
    } catch (err) {
      usuario = null; // no autenticado, continuar
    }

    // obtener producto desde backend
    const prodResp = await axios.get(`${URL_BACKEND}/productos/${id}`, {
      headers: { 'api-key-441': process.env.APIKEY_PASS }
    });

    const producto = prodResp.data.data;

    

    res.render('pages/detalle-producto', { producto, usuario });
  } catch (error) {
    console.error('Error cargando producto:', error.message || error);
    return res.status(500).render('pages/detalle-producto', { producto: null, usuario });
  }
});

module.exports = router;
