const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

axios.defaults.withCredentials = true;

const URL_BACKEND = process.env.URL_BACKEND || 'https://jesska-backend.onrender.com';

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

        // Manejar mensajes de éxito también cuando el usuario está logueado
        let successMessage = null;
        if (req.query.success === 'password_reset') {
            successMessage = 'Contraseña restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.';
        }

        res.render('pages/landing', { 
            usuario,
            success: successMessage,
            process: process
        });

    } catch (error) {
        // Manejar mensajes desde query parameters
        let errorMessage = null;
        let successMessage = null;
        
        if (req.query.error === 'acceso_denegado') {
            errorMessage = 'Acceso denegado. No tienes permisos para acceder al panel de administrador.';
        } else if (req.query.error === 'sesion_expirada') {
            errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
        } else if (req.query.success === 'password_reset') {
            successMessage = 'Contraseña restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.';
        }

        res.render('pages/landing', { 
            usuario: null,
            productosDestacados: [],
            error: errorMessage,
            success: successMessage,
            errorField: errorMessage ? 'general' : null,
            process: process
        });
    }
});

// Rutas de perfil movidas a frontend/router/router.perfil.js


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
        res.render('pages/catalogo', { 
            usuario, 
            productos,
            process: process 
        });

    } catch (error) {
        console.error('Error en catálogo:', error.message);
        res.render('pages/catalogo', { 
            usuario: null, 
            productos: [],
            process: process 
        });
    }
});

router.post('/register', async (req, res) => {
    const { nombre, email, telefono, password, 'g-recaptcha-response': recaptchaToken } = req.body;
    try {
        await axios.post(`${URL_BACKEND}/usuarios`, 
            { 
                nombre, 
                email, 
                password, 
                telefono,
                'g-recaptcha-response': recaptchaToken 
            }, 
            { 
                headers: { 'api-key-441': process.env.APIKEY_PASS },
                withCredentials: true
            }
        );

        // Registro exitoso: mostrar mensaje en landing
        res.render('pages/landing', { 
            usuario: null, 
            successRegister: 'Registro exitoso. Ahora puedes iniciar sesión.',
            process: process
        });
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
            regFormData: { nombre, email, telefono },
            process: process
        });
    }
});
router.post('/login', async (req, res) => {
  const { email, password, 'g-recaptcha-response': recaptchaToken } = req.body;
  try {
    const loginResponse = await axios.post(`${URL_BACKEND}/login`,
      { 
        email, 
        password, 
        'g-recaptcha-response': recaptchaToken // Incluir el token de reCAPTCHA
      },
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
    res.render('pages/landing', { 
        usuario, 
        success: 'Inicio de sesión exitoso',
        process: process
    });

  } catch (error) {
    console.error('Error en login:', error.message);
    
    let errorMessage = 'Error al iniciar sesión';
    let errorField = 'general';
    
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
      errorField = error.response.data.field || errorField;
      
      // Manejar específicamente errores de reCAPTCHA
      if (errorMessage.includes('reCAPTCHA') || errorMessage.includes('verificación')) {
        errorField = 'recaptcha';
      }
    }
    
    res.render('pages/landing', { 
      usuario: null,
      error: errorMessage,
      errorField: errorField,
      formData: { email, password: '' }, // Mantener email pero limpiar password
      process: process
    });
  }
});

// Ruta POST para solicitar recuperación de contraseña
router.post('/forgot-password', async (req, res) => {
  try {
    const response = await axios.post(`${URL_BACKEND}/login/forgot-password`, req.body, {
      headers: {
        'api-key-441': process.env.APIKEY_PASS,
        'Content-Type': 'application/json'
      }
    });
    
    // Devolver la respuesta JSON del backend
    res.json(response.data);
    
  } catch (error) {
    console.error('Error en recuperación:', error.response?.data || error.message);
    
    // Manejar errores del backend
    if (error.response && error.response.data) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
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
    console.log('id del producto: ' , id)
    // obtener producto desde backend
    // obtener producto desde backend
    const prodResp = await axios.get(`${URL_BACKEND}/productos/${id}`, {
      headers: { 'api-key-441': process.env.APIKEY_PASS }
    });

    const producto = prodResp.data.data;

    
    res.render('pages/detalle-producto', { 
        producto, 
        usuario,
        process: process 
    });
  } catch (error) {
    console.error('Error cargando producto:', error.message || error);
    return res.status(500).send('Error al cargar los Productos', error.message);
  }
});


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
        const productosCarrito = req.session.carrito || [];
        res.render('pages/carrito', { 
            usuario, 
            productosCarrito,
            process: process
        });

    } catch (error) {
        const productosCarrito = req.session.carrito || []; 
        res.render('pages/carrito', { 
            usuario: null, 
            productosCarrito,
            process: process 
        });
    }
});


// routes/carrito.js
router.post("/carrito/agregar", (req, res) => {
  const { productoId, nombre, precio, imagen } = req.body;
  let cantidad = parseInt(req.body.cantidad);

  // Validar cantidad mínima
  if (isNaN(cantidad) || cantidad < 1) cantidad = 1;

  // Inicializar carrito si no existe
  if (!req.session.carrito) req.session.carrito = [];

  // Buscar producto existente en el carrito
  const productoExistente = req.session.carrito.find(p => p.id && p.id.toString() === productoId);

  if (productoExistente) {
    // Si ya existe, sumar la cantidad
    productoExistente.cantidad += cantidad;
  } else {
    // Si no existe, agregar nuevo producto
    req.session.carrito.push({
      id: productoId,
      nombre,
      precio: parseFloat(precio),
      imagen,
      cantidad
    });
  }

  // Redirigir al carrito
  res.redirect('/carrito');
});

// Eliminar producto del carrito
router.post("/carrito/eliminar", async (req, res) => {
  const { productoId } = req.body;

  if (!req.session.carrito) req.session.carrito = [];

  req.session.carrito = req.session.carrito.filter(
    item => item.id.toString() !== productoId
  );

  res.redirect("/carrito");
});








// Ruta para iniciar el pago
router.post('/pagar', async (req, res) => {
  try {
    const rawItems = req.body.items;

    if (!rawItems || !Array.isArray(rawItems)) {
      return res.status(400).json({ error: 'Datos del carrito inválidos.' });
    }

    // Transformar los datos al formato que MercadoPago espera
    const items = rawItems.map(item => ({
      title: item.nombre,
      quantity: parseInt(item.cantidad),
      unit_price: parseFloat(item.precio)
    }));

    // Llamar al backend para crear la preferencia
    const respuesta = await axios.post(`${URL_BACKEND}/api/orden/crear`, { items });

    // Redirigir al checkout de MercadoPago
    res.redirect(respuesta.data.init_point);
  } catch (error) {
    console.error('Error al crear preferencia desde el frontend:', error.message);
    res.status(500).render('error', { mensaje: 'No se pudo iniciar el pago.' });
  }
});

// Rutas de retorno desde MercadoPago
router.get('/success', (req, res) => {
  res.render('success', { datos: req.query });
});

router.get('/failure', (req, res) => {
  res.render('failure', { datos: req.query });
});

router.get('/pending', (req, res) => {
  res.render('pending', { datos: req.query });
});

// Ruta para reset password
router.get('/reset-password/:token', (req, res) => {
    const token = req.params.token;
    res.render('pages/reset-password', { 
        token: token,
        process: process
    });
});

// Ruta POST para manejar el reset password
router.post('/reset-password/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const { password, confirmPassword } = req.body;

        // Validación básica
        if (!password || !confirmPassword) {
            return res.render('pages/reset-password', { 
                token: token,
                error: 'Todos los campos son obligatorios.',
                process: process
            });
        }

        if (password !== confirmPassword) {
            return res.render('pages/reset-password', { 
                token: token,
                error: 'Las contraseñas no coinciden.',
                process: process
            });
        }

        if (password.length < 6) {
            return res.render('pages/reset-password', { 
                token: token,
                error: 'La contraseña debe tener al menos 6 caracteres.',
                process: process
            });
        }

        // Enviar al backend
        const response = await axios.post(`${URL_BACKEND}/login/reset-password/${token}`, {
            password: password
        }, {
            headers: { 
                'api-key-441': process.env.APIKEY_PASS 
            }
        });

        // Redirigir a la página principal con mensaje de éxito
        res.redirect('/?success=password_reset');

    } catch (error) {
        console.error('Error en reset password:', error.response?.data || error.message);
        
        let errorMessage = 'Error interno del servidor.';
        if (error.response?.status === 400) {
            errorMessage = error.response.data.message || 'Token inválido o expirado.';
        }

        res.render('pages/reset-password', { 
            token: req.params.token,
            error: errorMessage,
            process: process
        });
    }
});

module.exports = router;

