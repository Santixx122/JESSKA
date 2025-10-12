const mongoose = require('mongoose'); 

const schemaUsuarios = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El campo del nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        match: [/^.+@.+\..+$/, 'El email debe ser válido'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    telefono: {
        type: String,
        match: [/^(3\d{9}|[1-9]\d{6,9})$/, 'El teléfono debe ser un número válido de 7 a 10 dígitos y debe comenzar por 3']
    },
    rol: {
        type: String,
        enum: ['usuario', 'administrador'],
        default:'usuario'
    },
    estado: {
        type: String,
        enum: ['activo', 'inactivo'],
        default: 'activo'
    }
}, {
    title: 'esquema de usuario'
});

module.exports = mongoose.model('usuarios', schemaUsuarios);

