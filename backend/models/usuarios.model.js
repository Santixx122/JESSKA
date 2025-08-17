const mongoose = require('mongoose')

const schemaUsuario = new mongoose.Schema({

    nombre:{
        type : String , required: true
    },
    apellidos:{
        type: String , required: true
    },
    cedula:{
        type: String , required: true
    },
    email:{
        type: String , required: true
    },
    password:{
        type: String , required:true
    },
    direccion: {
        calle: {
            type: String,
            required: true
        },
        numero: {
            type: String,
            required: true
        },
        ciudad: {
            type: String,
            required: true
        },
        codigoPostal: {
            type: String,
            required: true
        },
        pais: {
            type: String,
            required: true,
            default: "Colombia"
        }
    },
    telefono:{
        type: String , required: true
    },
    rol:{
        type: String,
        enum:['Cliente','Administrador','Usuario'],
        default: 'Usuario'
    }
})