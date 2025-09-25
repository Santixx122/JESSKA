


const mongoose = require('mongoose');

//Esquema de envios

const schemaEnvios = new mongoose.Schema({
    pedidoId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'pedidos',
        required: true,
        description: 'ID del pedido asociado al envío'
    },
    
    empresaTransporte:{
        type: String,
        required: [true,'El nombre de la empresa es obligatorio'],
        description: 'Nombre de la empresa de transporte'
    },
    estado:{
        type: String,
        enum:['pendiente','enviado','entregado','cancelado'],
        required: true,
        description: 'Estado actual del envío'
    }
},{
    title: 'esquema de envios'
});

module.exports = mongoose.model('envios',schemaEnvios);