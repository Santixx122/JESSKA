const Usuario = require('../models/usuarios.model');
const generateLog  = require('../services/log');
const crearEmail = require('../services/email.service')
const bcrypt = require('bcrypt')

class validacion{
    static usuario(usuario){
        if(typeof usuario!== 'string') throw new Error('El usuario debe ser un String')
        if(usuario.length < 3)throw new Error('El usuario debe ser mayor a 3 caracteres')
    }
    static password(password){
        if(typeof password!== 'string') throw new Error('El contraseña debe ser un String')
        if(password.length < 8)throw new Error('El contraseña debe ser mayor a 8 caracteres')
    }
}


function controlError(res, message, error) {
    res.status(500).json({
        success: false,
        message: message,
        error: error.message
    });
}

const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        generateLog.generateLog('usuarios.txt',`fecha: ${new Date()} metodo: ${req.method} `)
        /*crearEmail(
                process.env.EMAIL_USER,           
                'estebantoro.p.7@gmail.com',     
                'Backup de Usuarios',            
                'Adjunto el backup de la base de datos de usuarios' 
            );*/
            res.status(200).json({
            success: true,
            message: 'Usuarios encontrados con éxito.',
            data: usuarios
        });

    } catch (error) {
        console.error(error)
        controlError(res, 'Ocurrió un error al encontrar los usuarios', error);
    }
};

const getUsuarioById = async (req, res) => {
    try {
        const {email,password} = req.body;

        validacion.usuario(nombre)
        validacion.password(password)

        const usuario = await Usuario.findOne({email});
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        const isValid = await bcrypt.compare(password,usuario.password)
        if(!isValid){
            return res.status(404).json({
                success:false,
                message: 'El usuario es incorrecto'
            })
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true,
            message: 'Usuario encontrado con éxito',
            data: usuario,
            token
        });
    } catch (error) {
        controlError(res, 'Ocurrió un error al buscar el usuario', error);
    }
};


const createUsuario = async (req, res) => {

    try {
        let { nombre, email, password, telefono } = req.body;

        // Normalizar
        if (typeof email === 'string') email = email.toLowerCase().trim();
        if (typeof nombre === 'string') nombre = nombre.trim();
        if (typeof telefono === 'string') telefono = telefono.trim();

        // Validaciones básicas
        if (!nombre) {
            return res.status(400).json({ success: false, message: 'El nombre es obligatorio', field: 'nombre' });
        }
        try { validacion.usuario(nombre); } catch (e) { return res.status(400).json({ success: false, message: e.message, field: 'nombre' }); }

        if (!email) {
            return res.status(400).json({ success: false, message: 'El email es obligatorio', field: 'email' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'El email debe ser válido', field: 'email' });
        }

        if (!password) {
            return res.status(400).json({ success: false, message: 'La contraseña es obligatoria', field: 'password' });
        }
        try { validacion.password(password); } catch (e) { return res.status(400).json({ success: false, message: e.message, field: 'password' }); }

        const exist = await Usuario.findOne({ email });
        if (exist) {
            return res.status(400).json({ success: false, message: 'El email ya está registrado', field: 'email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const nuevoUsuario = await Usuario.create({ nombre, email, password: hashedPassword, telefono });
        res.status(201).json({
            success: true,
            message: 'El usuario se creó exitosamente',
            data: { id: nuevoUsuario._id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email, telefono: nuevoUsuario.telefono }
        });
    } catch (error) {
        // Manejar errores de validación de Mongoose y clave duplicada
        if (error && error.code === 11000) {
            return res.status(400).json({ success: false, message: 'El email ya está registrado', field: 'email' });
        }
        if (error && error.errors) {
            const firstKey = Object.keys(error.errors)[0];
            return res.status(400).json({ success: false, message: error.errors[firstKey].message, field: firstKey });
        }
        controlError(res, 'El usuario no pudo ser creado exitosamente', error);
    }
};


const updateUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        const nuevosDatos = { ...req.body };

        // Normalizar
        if (typeof nuevosDatos.email === 'string') nuevosDatos.email = nuevosDatos.email.toLowerCase().trim();
        if (typeof nuevosDatos.nombre === 'string') nuevosDatos.nombre = nuevosDatos.nombre.trim();
        if (typeof nuevosDatos.telefono === 'string') nuevosDatos.telefono = nuevosDatos.telefono.trim();

        // Si envía password, hashearla
        if (nuevosDatos.password) {
            if (typeof nuevosDatos.password !== 'string' || nuevosDatos.password.length < 8) {
                return res.status(400).json({ success: false, message: 'El contraseña debe ser mayor a 8 caracteres', field: 'password' });
            }
            nuevosDatos.password = await bcrypt.hash(nuevosDatos.password, 10);
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(id, nuevosDatos, { new: true, runValidators: true });

        if (!usuarioActualizado)
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });

        res.status(200).json({
            success: true,
            message: 'Usuario actualizado con éxito',
            data: { id: usuarioActualizado._id, nombre: usuarioActualizado.nombre, email: usuarioActualizado.email, telefono: usuarioActualizado.telefono }
        });
    } catch (error) {
        if (error && error.code === 11000) {
            return res.status(400).json({ success: false, message: 'El email ya está registrado', field: 'email' });
        }
        if (error && error.errors) {
            const firstKey = Object.keys(error.errors)[0];
            return res.status(400).json({ success: false, message: error.errors[firstKey].message, field: firstKey });
        }
        controlError(res, 'El usuario no se pudo actualizar', error);
    }
}; 


const deleteUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        const usuarioEliminado = await Usuario.findByIdAndDelete(id);

        if (!usuarioEliminado)
            return res.status(404).json({
                success: false,
                message: 'El usuario a eliminar no fue encontrado'
            });

        res.status(200).json({
            success: true,
            message: 'El usuario se eliminó con éxito',
            data: usuarioEliminado
        });
    } catch (error) {
        controlError(res, 'El usuario no se pudo eliminar', error);
    }
};

module.exports = {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario
};