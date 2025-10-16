const Pedido = require('../models/pedidos.model');
const Usuario = require('../models/usuarios.model');

function controlError(res,message,error){
    res.status(500).json({
        success:false,
        message:message,
        error: error
    });
}

const getPedidos = async (req,res) =>{
    try{
        const filtro = {};
        if (req.query.clienteId) filtro.clienteId = req.query.clienteId;
        const pedidos = await Pedido.find(filtro);
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
    console.log('=== CREAR PEDIDO - INICIO ===');
    console.log('Datos recibidos:', req.body);
    
    const { clienteId, fechaCreacion, total, estado } = req.body;
    
    // Validación de campos obligatorios
    if (!clienteId || !fechaCreacion || total === undefined || !estado) {
        console.log('Error: Campos faltantes');
        console.log('clienteId:', clienteId);
        console.log('fechaCreacion:', fechaCreacion);
        console.log('total:', total);
        console.log('estado:', estado);
        return res.status(400).json({
            success: false,
            message: 'clienteId, fechaCreacion, total y estado son obligatorios'
        });
    }
    
    // Validación de formato de ObjectId
    if (!clienteId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log('Error: Formato de ObjectId inválido:', clienteId);
        return res.status(400).json({
            success: false,
            message: 'El ID del cliente no tiene un formato válido'
        });
    }
    
    try {
        console.log('Verificando si el usuario existe...');
        // Verificar que el usuario existe
        const usuarioExiste = await Usuario.findById(clienteId);
        if (!usuarioExiste) {
            console.log('Error: Usuario no encontrado con ID:', clienteId);
            return res.status(400).json({
                success: false,
                message: 'El usuario con ese ID no existe'
            });
        }
        
        console.log('Usuario encontrado:', usuarioExiste._id);
        console.log('Creando pedido...');
        
        const nuevoPedido = await Pedido.create({ clienteId, fechaCreacion, total, estado });
        console.log('Pedido creado exitosamente:', nuevoPedido);
        
        res.status(201).json({
            success: true,
            message: 'El pedido se creó exitosamente',
            data: nuevoPedido
        });
    } catch (error) {
        console.error('=== ERROR DETALLADO ===');
        console.error('Error completo:', error);
        console.error('Stack trace:', error.stack);
        console.error('Mensaje:', error.message);
        console.error('========================');
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