const mongoose = require('mongoose');

//Esquema de admin

const schemaAdmin = new mongoose.Schema({
    usuarioId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios',
        required: true,
    },
    cedula:{
        type: String,
        minLength: 7
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('admin', schemaAdmin, 'admin');