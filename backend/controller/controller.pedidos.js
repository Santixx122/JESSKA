const Pedido = require('../models/pedidos.model');

function controlError(res,message,error){
    res.status(500).json({
        success:false,
        message:message,
        error: error
    });
}

const getPedidos = async (req,res) =>{
    try{
        const pedidos = await Pedido.find();
        res.status(200).json({
            success:true,
            message:'pedidos encontrados con exito.',
            data:pedidos
        });
    }catch(error){
        controlError(res, 'Ocurrio un error al encontrar los pedidos', error);
    }
};

const getPedidoById = async (req, res) => {
    try {
        const id = req.params.id;
        const pedido = await Pedido.findById(id);
        if (!pedido) {
            return res.status(404).json({
                success: false,
                message: 'Pedido no encontrado'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Pedido encontrado con éxito',
            data: pedido
        });
    } catch (error) {
        controlError(res, 'Ocurrió un error al buscar el pedido', error);
    }
};

const createPedido = async (req, res) => {
    const { clienteId, fechaCreacion, total, estado } = req.body;
    if (!clienteId || !fechaCreacion || total === undefined || !estado) {
        return res.status(400).json({
            success: false,
            message: 'clienteId, fechaCreacion, total y estado son obligatorios'
        });
    }
    try {
        const nuevoPedido = await Pedido.create({ clienteId, fechaCreacion, total, estado });
        res.status(201).json({
            success: true,
            message: 'El pedido se creó exitosamente',
            data: nuevoPedido
        });
    } catch (error) {
        controlError(res, 'El pedido no pudo ser creado exitosamente', error);
    }
};

const updatePedido = async (req, res) => {
    try {
        const id = req.params.id;
        const nuevosDatos = req.body;
        const pedidoActualizado = await Pedido.findByIdAndUpdate(id, nuevosDatos, { new: true });

        if (!pedidoActualizado)
            return res.status(404).json({
                success: false,
                message: 'pedido no encontrado'
            });

        res.status(200).json({
            success: true,
            message: 'pedido actualizado con éxito',
            data: pedidoActualizado
        });
    } catch (error) {
        controlError(res, 'El pedido no se pudo actualizar', error);
    }
};


const deletePedido = async (req, res) => {
    try {
        const id = req.params.id;
        const pedidoEliminado = await Pedido.findByIdAndDelete(id);

        if (!pedidoEliminado)
            return res.status(404).json({
                success: false,
                message: 'El pedido a eliminar no fue encontrado'
            });

        res.status(200).json({
            success: true,
            message: 'El pedido se eliminó con éxito',
            data: pedidoEliminado
        });
    } catch (error) {
        controlError(res, 'El pedido no se pudo eliminar', error);
    }
};


module.exports = {
    getPedidos,
    getPedidoById,
    createPedido,
    updatePedido,
    deletePedido
};