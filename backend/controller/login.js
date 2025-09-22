const Usuario=require('../models/usuarios.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@(gmail\.com|hotmail\.com)$/;
    return emailRegex.test(email);
};

const login = async (req,res)=>{
    const { email, password } = req.body;
    
    // Validaciones de entrada
    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email y contraseña son requeridos',
            field: !email ? 'email' : 'password'
        });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ 
            success: false, 
            message: 'El formato del email no es válido',
            field: 'email'
        });
    }

    if (password.length < 6) {
        return res.status(400).json({ 
            success: false, 
            message: 'La contraseña debe tener al menos 6 caracteres',
            field: 'password'
        });
    }

    try {
        // Buscar usuario por email
        const user = await Usuario.findOne({email: email.toLowerCase()});

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Credenciales incorrectas',
                field: 'email'
            });
        }

        // Verificar si el usuario está activo
        if (user.estado !== 'activo') {
            return res.status(403).json({ 
                success: false, 
                message: 'Usuario inactivo. Contacte al administrador',
                field: 'general'
            });
        }

        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ 
                success: false, 
                message: 'Credenciales incorrectas',
                field: 'password'
            });
        }

        // Crear token JWT 
        const token = jwt.sign(
            {
                email: user.email,
                id: user._id,
                rol: user.rol,
                nombre: user.nombre
            },
            process.env.SECRET_KEY,
            { expiresIn: '24h' } 
        );

        // Configurar cookie con token
        res
            .cookie('access_token',token,{
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 1000 * 60 * 60 * 24 
            })
            .status(200).json({
                success: true,
                message: 'Login exitoso',
                usuario: {
                    id: user._id,
                    nombre: user.nombre,
                    email: user.email,
                    rol: user.rol
                }
            });

    } catch (error) {
        console.error('Error en login:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor. Intente nuevamente',
            field: 'general'
        });
    }
}
module.exports=login