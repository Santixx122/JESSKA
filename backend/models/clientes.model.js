const mongoose = require('mongoose');

//Schema de clientes

const schemaClientes = new mongoose.Schema({
    usuarioId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios',
        required: [true, 'El ID del usuario es obligatorio'],
        description: 'ID del usuario que pertenece a cada cliente'
    },
    comprasRealizadas:{
        type: Number,
        required: [true],
        min:0
    }
},{
    title:'Schema de clientes'
});

module.exports  = mongoose.model('pedidos',schemaClientes)


