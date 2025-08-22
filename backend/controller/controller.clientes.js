const Cliente = require('../models/clientes.model');

function controlError(res, message, error) {
    res.status(500).json({
        success: false,
        message: message,
        error: error.message
    });
}


const getClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.status(200).json({
            success: true,
            message: 'Clientes encontrados con éxito.',
            data: clientes
        });
    } catch (error) {
        controlError(res, 'Ocurrió un error al encontrar los clientes', error);
    }
};

const getClienteById = async (req, res) => {
    try {
        const id = req.params.id;
        const cliente = await Cliente.findById(id);
        if (!cliente) {
            return res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Cliente encontrado con éxito',
            data: cliente
        });
    } catch (error) {
        controlError(res, 'Ocurrió un error al buscar el cliente', error);
    }
};


const createCliente = async (req, res) => {
    const { usuarioId, comprasRealizadas } = req.body;
    if (!usuarioId || comprasRealizadas === undefined) {
        return res.status(400).json({
            success: false,
            message: 'usuarioId y comprasRealizadas son obligatorios'
        });
    }
    try {
        const nuevoCliente = await Cliente.create({ usuarioId, comprasRealizadas });
        res.status(201).json({
            success: true,
            message: 'El cliente se creó exitosamente',
            data: nuevoCliente
        });
    } catch (error) {
        controlError(res, 'El cliente no pudo ser creado exitosamente', error);
    }
};


const updateCliente = async (req, res) => {
    try {
        const id = req.params.id;
        const nuevosDatos = req.body;
        const clienteActualizado = await Cliente.findByIdAndUpdate(id, nuevosDatos, { new: true });

        if (!clienteActualizado)
            return res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });

        res.status(200).json({
            success: true,
            message: 'Cliente actualizado con éxito',
            data: clienteActualizado
        });
    } catch (error) {
        controlError(res, 'El cliente no se pudo actualizar', error);
    }
};


const deleteCliente = async (req, res) => {
    try {
        const id = req.params.id;
        const clienteEliminado = await Cliente.findByIdAndDelete(id);

        if (!clienteEliminado)
            return res.status(404).json({
                success: false,
                message: 'El cliente a eliminar no fue encontrado'
            });

        res.status(200).json({
            success: true,
            message: 'El cliente se eliminó con éxito',
            data: clienteEliminado
        });
    } catch (error) {
        controlError(res, 'El cliente no se pudo eliminar', error);
    }
};

module.exports = {
    getClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente
};