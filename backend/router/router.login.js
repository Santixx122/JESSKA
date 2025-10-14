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