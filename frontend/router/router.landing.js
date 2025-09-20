const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

axios.defaults.withCredentials = true;

const URL_BACKEND = process.env.URL_BACKEND || 'http://localhost:4040';

router.get('/', async (req, res) => {
    try {
        const respuesta = await axios.get(`${URL_BACKEND}/login/me`, {
            headers: { 
                'api-key-441': process.env.APIKEY_PASS,
                // reenviar cookies del navegador al backend para validar sesión
                ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {})
            },
            withCredentials: true
        });

        const usuario = respuesta.data.usuario;
        res.render('pages/landing', { usuario });

    } catch (error) {
        res.render('pages/landing', { usuario: null });
    }
});

// Datos del perfil: pedidos del usuario autenticado
router.get('/perfil/pedidos', async (req, res) => {
  try {
    const me = await axios.get(`${URL_BACKEND}/login/me`, {
      headers: { 'api-key-441': process.env.APIKEY_PASS, ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {}) },
      withCredentials: true
    });
    const usuario = me.data.usuario;
    if (!usuario) return res.status(401).json({ success: false, message: 'No autenticado' });

    // Buscar cliente por usuarioId para obtener el clienteId
    const clientesResp = await axios.get(`${URL_BACKEND}/clientes`, {
      headers: { 'api-key-441': process.env.APIKEY_PASS, ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {}) },
      params: { usuarioId: usuario._id },
      withCredentials: true
    });
    const clientes = clientesResp.data?.data || [];
    const cliente = clientes[0];
    if (!cliente) return res.json({ success: true, data: [] });

    const pedidosResp = await axios.get(`${URL_BACKEND}/pedidos`, {
      headers: { 'api-key-441': process.env.APIKEY_PASS, ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {}) },
      params: { clienteId: cliente._id },
      withCredentials: true
    });
    return res.json({ success: true, data: pedidosResp.data?.data || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al obtener pedidos' });
  }
});

// Datos del perfil: mensajes del usuario autenticado
router.get('/perfil/mensajes', async (req, res) => {
  try {
    const me = await axios.get(`${URL_BACKEND}/login/me`, {
      headers: { 'api-key-441': process.env.APIKEY_PASS, ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {}) },
      withCredentials: true
    });
    const usuario = me.data.usuario;
    if (!usuario) return res.status(401).json({ success: false, message: 'No autenticado' });

    const msgs = await axios.get(`${URL_BACKEND}/mensajes`, {
      headers: { 'api-key-441': process.env.APIKEY_PASS, ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {}) },
      params: { usuarioId: usuario._id },
      withCredentials: true
    });
    return res.json({ success: true, data: msgs.data?.data || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al obtener mensajes' });
  }
});

// Datos del perfil: reseñas del usuario autenticado
router.get('/perfil/resenas', async (req, res) => {
  try {
    const me = await axios.get(`${URL_BACKEND}/login/me`, {
      headers: { 'api-key-441': process.env.APIKEY_PASS, ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {}) },
      withCredentials: true
    });
    const usuario = me.data.usuario;
    if (!usuario) return res.status(401).json({ success: false, message: 'No autenticado' });

    const rs = await axios.get(`${URL_BACKEND}/resenas`, {
      headers: { 'api-key-441': process.env.APIKEY_PASS, ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {}) },
      params: { usuarioId: usuario._id },
      withCredentials: true
    });
    return res.json({ success: true, data: rs.data?.data || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al obtener reseñas' });
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

// Página de perfil (requiere sesión)
router.get('/perfil', async (req, res) => {
  try {
    const me = await axios.get(`${URL_BACKEND}/login/me`, {
      headers: { 
        'api-key-441': process.env.APIKEY_PASS,
        ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {})
      },
      withCredentials: true
    });
    const usuario = me.data.usuario;
    if (!usuario) return res.redirect('/');
    res.render('pages/perfil', { usuario, success: null, error: null, errorField: null });
  } catch (error) {
    return res.redirect('/');
  }
});

// Actualizar perfil (nombre, telefono, password)
router.post('/perfil', async (req, res) => {
  const { nombre, telefono, password } = req.body;
  try {
    // obtener usuario actual
    const me = await axios.get(`${URL_BACKEND}/login/me`, {
      headers: { 
        'api-key-441': process.env.APIKEY_PASS,
        ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {})
      },
      withCredentials: true
    });
    const usuario = me.data.usuario;
    if (!usuario) return res.redirect('/');

    const payload = {};
    if (nombre) payload.nombre = nombre;
    if (telefono) payload.telefono = telefono;
    if (password) payload.password = password;

    const updated = await axios.put(`${URL_BACKEND}/usuarios/${usuario._id}`, payload, {
      headers: { 
        'api-key-441': process.env.APIKEY_PASS,
        ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {})
      },
      withCredentials: true
    });

    const nuevoUsuario = { ...usuario, ...updated.data.data };
    res.render('pages/perfil', { usuario: nuevoUsuario, success: 'Perfil actualizado correctamente', error: null, errorField: null });
  } catch (error) {
    console.error('Error al actualizar perfil:', error.message);
    let errorMessage = 'No se pudo actualizar el perfil';
    let errorField = 'general';
    let usuario = null;
    try {
      const me = await axios.get(`${URL_BACKEND}/login/me`, {
        headers: { 'api-key-441': process.env.APIKEY_PASS, ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {}) },
        withCredentials: true
      });
      usuario = me.data.usuario;
    } catch {}
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
      errorField = error.response.data.field || errorField;
    }
    res.render('pages/perfil', { usuario, success: null, error: errorMessage, errorField });
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


module.exports = router;
