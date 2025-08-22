const Usuario = require('../models/usuarios.model');

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
        res.status(200).json({
            success: true,
            message: 'Usuarios encontrados con éxito.',
            data: usuarios
        });
    } catch (error) {
        controlError(res, 'Ocurrió un error al encontrar los usuarios', error);
    }
};


const getUsuarioById = async (req, res) => {
    try {
        const id = req.params.id;
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Usuario encontrado con éxito',
            data: usuario
        });
    } catch (error) {
        controlError(res, 'Ocurrió un error al buscar el usuario', error);
    }
};


const createUsuario = async (req, res) => {
    const { nombre, email, password, telefono, rol, estado } = req.body;
    if (!nombre || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'nombre, email y password son obligatorios'
        });
    }
    try {
        const nuevoUsuario = await Usuario.create({ nombre, email, password, telefono, rol, estado });
        res.status(201).json({
            success: true,
            message: 'El usuario se creó exitosamente',
            data: nuevoUsuario
        });
    } catch (error) {
        controlError(res, 'El usuario no pudo ser creado exitosamente', error);
    }
};


const updateUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        const nuevosDatos = req.body;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(id, nuevosDatos, { new: true });

        if (!usuarioActualizado)
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });

        res.status(200).json({
            success: true,
            message: 'Usuario actualizado con éxito',
            data: usuarioActualizado
        });
    } catch (error) {
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