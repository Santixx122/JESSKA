const Envio = require('../models/envios.model');

function controlError(res,message,error){
    res.status(500).json({
        success:false,
        message:message,
        error: error.message
    });
}

const getEnvios = async(req,res)=>{
    try {
        const envios = await Envio.find();
        res.status(200).json({
           success:true,
           message: 'Envios encontrados con exito',
           data: envios
        });
    } catch (error) {
        controlError(res,'Ocurrio un error al encontrar los envios', error);
    }
};
const getEnvioById = async (req, res) => {
    try {
        const id = req.params.id;
        const envio = await Envio.findById(id);
        if (!envio) {
            return res.status(404).json({
                success: false,
                message: 'Envío no encontrado'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Envío encontrado con éxito',
            data: envio
        });
    } catch (error) {
        controlError(res, 'Ocurrió un error al buscar el envío', error);
    }
};
const createEnvio = async (req, res) => {
    try {
        const envio = {
            pedidoId: req.body.pedidoId,
            direccionId: req.body.direccionId,
            empresaTransporte: req.body.empresaTransporte,
            estado: req.body.estado
        };
        const nuevoEnvio = await Envio.create(envio);
        res.status(201).json({
            success: true,
            message: 'El envío se creó exitosamente',
            data: nuevoEnvio
        });
    } catch (error) {
        controlError(res, 'El envío no pudo ser creado exitosamente', error);
    }
};

const updateEnvio = async (req, res) => {
    try {
        const id = req.params.id;
        const nuevosDatos = req.body;
        const envioActualizado = await Envio.findByIdAndUpdate(id, nuevosDatos, { new: true });

        if (!envioActualizado)
            return res.status(404).json({
                success: false,
                message: 'Envío no encontrado'
            });

        res.status(200).json({
            success: true,
            message: 'Envío actualizado con éxito',
            data: envioActualizado
        });
    } catch (error) {
        controlError(res, 'El envío no se pudo actualizar', error);
    }
};

const deleteEnvio = async (req, res) => {
    try {
        const id = req.params.id;
        const envioEliminado = await Envio.findByIdAndDelete(id);

        if (!envioEliminado)
            return res.status(404).json({
                success: false,
                message: 'El envío a eliminar no fue encontrado'
            });

        res.status(200).json({
            success: true,
            message: 'El envío se eliminó con éxito',
            data: envioEliminado
        });
    } catch (error) {
        controlError(res, 'El envío no se pudo eliminar', error);
    }
};

module.exports = {
    getEnvios,
    getEnvioById,
    createEnvio,
    updateEnvio,
    deleteEnvio
};