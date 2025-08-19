const mongoose = require('mongoose');

//Esquema de admin

const schemaAdmin = new mongoose.Schema({
    usuarioId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios',
        required: true,
    },
    cedula:{
        type: Number,
        min: 1000000
    }
})

module.exports = mongoose.model('admin', schemaAdmin);