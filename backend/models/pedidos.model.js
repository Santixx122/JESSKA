const mongoose = require('mongoose');

//Schema de pedidos

const schemaPedidos = new mongoose.Schema({
    clienteId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clientes',
        required: [true, 'La referencia al ID del cliente es obligatoria'],
        description: 'ID del cliente que pertenece a cada pedido '
    },
    fechaCreacion:{
        type: Date,
        required: [true, 'La fecha de creacion es obligatoria'],
        description: 'La fecha de creacion es obligatoria'
    },
    total:{
        type: Number,
        min:[0,'El total debe ser mayor o igual a 0'],
        required: [true, 'El total es obligatorio'],
        description: 'El total es obligatorio'   
    },
    estado:{
        type: String,
        enum:['pagado','entregado', 'en proceso', 'cancelado','devuelto'],
        required: [true, 'Se debe elegir un estado del producto'],
        description:'se debe elegir un estado del producto'
    }
},{
    title:'esquema de pedidos'
})

module.exports = mongoose.model('pedidos', schemaPedidos)