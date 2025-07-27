const mongoose = require('mongoose')

const SchemaProducto = new mongoose.Schema({
    referencia:{
        type: String,required:true,
        // Solo letras mayúsculas y números
        match: /^[A-Z0-9]+$/  
    },
    marca:{
        type: String, required:true,
        trim:true
    },
    nombre:{
        type: String, required:true,
        maxLength: 100
    },
    descripcion:{
        type: String,required:true,
        maxLength:500,
        minLength: 10
    },
    precio:{
        type:Number,required: true,
        min: 0
    },
    cantidad:{
        type: Number,required:true
    }

})
module.exports= mongoose.model('Productos',SchemaProducto);