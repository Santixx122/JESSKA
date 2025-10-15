const express = require('express');
const router = express.Router();
const login = require('../controller/login')
const validatorApiKey = require('../apiKey/apikey')
const verifyToken = require('../middleware/validacionToken');
const { verifyRecaptcha } = require('../middleware/recaptcha');
const Usuario=require('../models/usuarios.model')


router.use(validatorApiKey)

// Aplicar middleware de reCAPTCHA al endpoint de login
router.post('/', verifyRecaptcha, login)
router.get('/me', verifyToken, async (req, res) => {
    try {
        const usuario = await Usuario.findOne({ email: req.user.email }).select("-password");
        res.json({ usuario });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener sesión' });
    }
});

// Endpoint para recuperación de contraseña
router.post('/forgot-password', verifyRecaptcha, async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'El email es requerido',
                field: 'email'
            });
        }

        // Buscar usuario por email
        const usuario = await Usuario.findOne({ email });
        
        // Por seguridad, siempre respondemos lo mismo, exista o no el usuario
        const successMessage = 'Si tu email está registrado en nuestro sistema, recibirás un enlace para restablecer tu contraseña en los próximos minutos.';
        
        if (!usuario) {
            return res.status(200).json({
                success: true,
                message: successMessage
            });
        }

        // Generar token de recuperación
        const crypto = require('crypto');
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = Date.now() + 3600000; // 1 hora

        // Guardar token en la base de datos
        usuario.resetPasswordToken = resetToken;
        usuario.resetPasswordExpires = resetTokenExpires;
        await usuario.save();

        // Configurar nodemailer (si tienes las credenciales configuradas)
        if (process.env.EMAIL_USER && process.env.PASS_USER) {
            const nodemailer = require('nodemailer');
            
            const transportador = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.PASS_USER
                }
            });

            // Usar la URL del frontend desde variable de entorno
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5050';
            const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
            
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Recuperación de contraseña - JESSKA',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Recuperación de contraseña</h2>
                        <p>Hola ${usuario.nombre},</p>
                        <p>Recibimos una solicitud para restablecer tu contraseña en JESSKA.</p>
                        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                        <a href="${resetUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
                        <p><strong>Este enlace expirará en 1 hora.</strong></p>
                        <p>Si no solicitaste este cambio, puedes ignorar este email.</p>
                        <hr>
                        <p><small>Equipo JESSKA</small></p>
                    </div>
                `
            };

            try {
                await transportador.sendMail(mailOptions);
                console.log('Email de recuperación enviado a:', email);
            } catch (emailError) {
                console.error('Error enviando email:', emailError);
                // No mostramos el error al usuario por seguridad
            }
        }

        res.status(200).json({
            success: true,
            message: successMessage
        });

    } catch (error) {
        console.error('Error en forgot-password:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Ruta GET para mostrar la página de nueva contraseña
router.get('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;

        // Verificar que el token existe y no ha expirado
        const usuario = await Usuario.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!usuario) {
            return res.render('pages/error404', {
                title: 'Enlace inválido',
                message: 'El enlace de recuperación es inválido o ha expirado'
            });
        }

        res.render('pages/reset-password', {
            title: 'Nueva Contraseña',
            token,
            email: usuario.email
        });

    } catch (error) {
        console.error('Error al mostrar formulario reset:', error);
        res.render('pages/error500', {
            title: 'Error del servidor',
            message: 'Error interno del servidor'
        });
    }
});

// Ruta POST para procesar la nueva contraseña
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Validar longitud de contraseña
        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        // Buscar usuario por token
        const usuario = await Usuario.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!usuario) {
            return res.status(400).json({
                success: false,
                message: 'El enlace de recuperación es inválido o ha expirado'
            });
        }

        // Encriptar nueva contraseña
        const bcrypt = require('bcrypt');
        const passwordEncriptada = await bcrypt.hash(password, 10);

        // Actualizar contraseña y limpiar tokens
        usuario.password = passwordEncriptada;
        usuario.resetPasswordToken = null;
        usuario.resetPasswordExpires = null;
        await usuario.save();

        // Respuesta exitosa
        res.json({
            success: true,
            message: 'Contraseña restablecida exitosamente'
        });

    } catch (error) {
        console.error('Error al restablecer contraseña:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Endpoint para logout
router.post('/logout', (req, res) => {
    try {
        res
            .clearCookie('access_token', {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production'
            })
            .status(200).json({
                success: true,
                message: 'Logout exitoso'
            });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error al cerrar sesión' 
        });
    }
});
module.exports= router