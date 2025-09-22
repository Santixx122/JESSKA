const Factura = require('../models/facturas.model');

function controlError(res, message, error) {
    res.status(500).json({
        success: false,
        message: message,
        error: error.message
    });
}

const getFacturas = async (req, res) => {
    try {
        const facturas = await Factura.find();
        res.status(200).json({
            success: true,
            message: 'Facturas encontradas con éxito.',
            data: facturas
        });
    } catch (error) {
        controlError(res, 'Ocurrió un error al encontrar las facturas', error);
    }
};


const getFacturaById = async (req, res) => {
    try {
        const id = req.params.id;
        const factura = await Factura.findById(id);
        if (!factura) {
            return res.status(404).json({
                success: false,
                message: 'Factura no encontrada'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Factura encontrada con éxito',
            data: factura
        });
    } catch (error) {
        controlError(res, 'Ocurrió un error al buscar la factura', error);
    }
};


const createFactura = async (req, res) => {
    const { pedidoId, fechaCreacion } = req.body;
    if (!pedidoId || !fechaCreacion) {
        return res.status(400).json({
            success: false,
            message: 'pedidoId y fechaCreacion son obligatorios'
        });
    }
    try {
        const nuevaFactura = await Factura.create({ pedidoId, fechaCreacion });
        res.status(201).json({
            success: true,
            message: 'La factura se creó exitosamente',
            data: nuevaFactura
        });
    } catch (error) {
        controlError(res, 'La factura no pudo ser creada exitosamente', error);
    }
};


const updateFactura = async (req, res) => {
    try {
        const id = req.params.id;
        const nuevosDatos = req.body;
        const facturaActualizada = await Factura.findByIdAndUpdate(id, nuevosDatos, { new: true });

        if (!facturaActualizada)
            return res.status(404).json({
                success: false,
                message: 'Factura no encontrada'
            });

        res.status(200).json({
            success: true,
            message: 'Factura actualizada con éxito',
            data: facturaActualizada
        });
    } catch (error) {
        controlError(res, 'La factura no se pudo actualizar', error);
    }
};


const deleteFactura = async (req, res) => {
    try {
        const id = req.params.id;
        const facturaEliminada = await Factura.findByIdAndDelete(id);

        if (!facturaEliminada)
            return res.status(404).json({
                success: false,
                message: 'La factura a eliminar no fue encontrada'
            });

        res.status(200).json({
            success: true,
            message: 'La factura se eliminó con éxito',
            data: facturaEliminada
        });
    } catch (error) {
        controlError(res, 'La factura no se pudo eliminar', error);
    }
};

module.exports = {
    getFacturas,
    getFacturaById,
    createFactura,
    updateFactura,
    deleteFactura
};