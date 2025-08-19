const mongoose = require('mongoose');

//Esquema de factura

const schemaFactura = new mongoose.Schema({
    pedidoId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pedidos',
        require: true,
        description:' La referencia a el ID del pedido es obligatoria'
    },
    fechaCreacion:{
        type: Date,
        require: true,
        description: 'La fecha de creacion es obligatoria'
    }
})

module.exports = mongoose.model('factura', schemaFactura);