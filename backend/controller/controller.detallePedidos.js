const DetallePedido = require('../models/detallePedidos.model');

function controlError(res,message,error){
    res.status(500).json({
        success: false,
        message:message,
        error:error.message
    });
}

const getDetallesPedidos = async(req,res)=>{
    try {
        const detalles = await DetallePedido.find();
        res.status(200).json({
            success: true,
            message: 'Detalles de pedidos encontrados con éxito.',
            data: detalles
        });
    } catch (error) {
        controlError(res, 'Ocurrió un error al encontrar los detalles de pedidos', error);
    }
};


const getDetallePedidoById = async (req, res) => {
    try {
        const id = req.params.id;
        const detalle = await DetallePedido.findById(id);
        if (!detalle) {
            return res.status(404).json({
                success: false,
                message: 'Detalle de pedido no encontrado'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Detalle de pedido encontrado con éxito',
            data: detalle
        });
    } catch (error) {
        controlError(res, 'Ocurrió un error al buscar el detalle de pedido', error);
    }
};

const createDetallePedido = async (req, res) => {
    const { pedidoId, productoId, cantidad, precio } = req.body;
    if (!pedidoId || !productoId || cantidad === undefined || precio === undefined) {
        return res.status(400).json({
            success: false,
            message: 'pedidoId, productoId, cantidad y precio son obligatorios'
        });
    }
    try {
        const nuevoDetalle = await DetallePedido.create({ pedidoId, productoId, cantidad, precio });
        res.status(201).json({
            success: true,
            message: 'El detalle de pedido se creó exitosamente',
            data: nuevoDetalle
        });
    } catch (error) {
        controlError(res, 'El detalle de pedido no pudo ser creado exitosamente', error);
    }
};

const updateDetallePedido = async (req, res) => {
    try {
        const id = req.params.id;
        const nuevosDatos = req.body;
        const detalleActualizado = await DetallePedido.findByIdAndUpdate(id, nuevosDatos, { new: true });

        if (!detalleActualizado)
            return res.status(404).json({
                success: false,
                message: 'Detalle de pedido no encontrado'
            });

        res.status(200).json({
            success: true,
            message: 'Detalle de pedido actualizado con éxito',
            data: detalleActualizado
        });
    } catch (error) {
        controlError(res, 'El detalle de pedido no se pudo actualizar', error);
    }
};

const deleteDetallePedido = async (req, res) => {
    try {
        const id = req.params.id;
        const detalleEliminado = await DetallePedido.findByIdAndDelete(id);

        if (!detalleEliminado)
            return res.status(404).json({
                success: false,
                message: 'El detalle de pedido a eliminar no fue encontrado'
            });

        res.status(200).json({
            success: true,
            message: 'El detalle de pedido se eliminó con éxito',
            data: detalleEliminado
        });
    } catch (error) {
        controlError(res, 'El detalle de pedido no se pudo eliminar', error);
    }
};

module.exports = {
    getDetallesPedidos,
    getDetallePedidoById,
    createDetallePedido,
    updateDetallePedido,
    deleteDetallePedido
};