const Admin = require('../models/admin.model');

function controlError(res,message,error){
    res.status(500).json({
        success: false,
        message:message,
        error: error.message
    });
}

const getAdmins = async(req,res)=>{
    try {
        const admins = await Admin.find();
        res.status(200).json({
            success: true,
            massage:'Administradores encontrados con exito',
            data: admins
        })
    } catch (error) {
        controlError(res, 'Ocurrio un eror al encontrar los administradores', error);
    }
};

const getAdminById = async (req, res) => {
    try {
        const id = req.params.id;
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Administrador no encontrado'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Administrador encontrado con éxito',
            data: admin
        });
    } catch (error) {
        controlError(res, 'Ocurrió un error al buscar el administrador', error);
    }
};

const createAdmin = async (req, res) => {
    const { usuarioId, cedula } = req.body;
    if (!usuarioId || !cedula) {
        return res.status(400).json({
            success: false,
            message: 'usuarioId y cedula son obligatorios'
        });
    }
    try {
        const nuevoAdmin = await Admin.create({ usuarioId, cedula });
        res.status(201).json({
            success: true,
            message: 'El administrador se creó exitosamente',
            data: nuevoAdmin
        });
    } catch (error) {
        controlError(res, 'El administrador no pudo ser creado exitosamente', error);
    }
};

const updateAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        const nuevosDatos = req.body;
        const adminActualizado = await Admin.findByIdAndUpdate(id, nuevosDatos, { new: true });

        if (!adminActualizado)
            return res.status(404).json({
                success: false,
                message: 'Administrador no encontrado'
            });

        res.status(200).json({
            success: true,
            message: 'Administrador actualizado con éxito',
            data: adminActualizado
        });
    } catch (error) {
        controlError(res, 'El administrador no se pudo actualizar', error);
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        const adminEliminado = await Admin.findByIdAndDelete(id);

        if (!adminEliminado)
            return res.status(404).json({
                success: false,
                message: 'El administrador a eliminar no fue encontrado'
            });

        res.status(200).json({
            success: true,
            message: 'El administrador se eliminó con éxito',
            data: adminEliminado
        });
    } catch (error) {
        controlError(res, 'El administrador no se pudo eliminar', error);
    }
};

module.exports = {
    getAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin
};