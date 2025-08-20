const mongoose = require('mongoose');

//esquema de detallePedido

const schemaDetallePedido = new mongoose.Schema({
    pedidoId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pedidos',
        required: true,
        description: 'El ID del pedido debe ser referenciado obligatoriamente'
    },
    productoId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'productos',
        required: true,
        description: 'El ID del producto debe ser referenciado obligatoriamente'
    },
    cantidad:{
        type: Number,
        min: 1,
        required: true,
        description: 'La cantidad es obligatoria'
    },
    precio:{
        type: Number,
        min: 0,
        required: true,
        description: 'El precio es obligatorio'
    }
})

module.exports = mongoose.model('detallePedido', schemaDetallePedido);