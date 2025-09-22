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

        // Try to get featured products (this will be managed by admin)
        let productosDestacados = [];
        try {
            const productosResponse = await axios.get(`${URL_BACKEND}/productos/destacados`, {
                headers: { 'api-key-441': process.env.APIKEY_PASS }
            });
            productosDestacados = productosResponse.data;
        } catch (productError) {
            console.log('No featured products found or error fetching them:', productError.message);
        }

        res.render('pages/landing', { usuario, productosDestacados });

    } catch (error) {
        res.render('pages/landing', { usuario: null, productosDestacados: [] });
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
        const respuesta = await axios.get(`${URL_BACKEND}/login/me`, {
            headers: { 
                'api-key-441': process.env.APIKEY_PASS,
                ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {})
            },
            withCredentials: true
        });

        const usuario = respuesta.data.usuario;
        res.render('pages/catalogo', { usuario });

    } catch (error) {
        res.render('pages/catalogo', { usuario: null });
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
        res.render('pages/landing', { usuario: null, productosDestacados: [], successRegister: 'Registro exitoso. Ahora puedes iniciar sesión.' });
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
            productosDestacados: [],
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
    res.render('pages/landing', { usuario, productosDestacados: [], success: 'Inicio de sesión exitoso' });

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
      productosDestacados: [],
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


module.exports = router;
