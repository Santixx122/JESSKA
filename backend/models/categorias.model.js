const mongoose = require('mongoose')

// Schema de categorías basado en el schema de MongoDB corregido
const SchemaCategoria = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        maxLength: [100, 'El nombre no puede exceder 100 caracteres'],
        minLength: [2, 'El nombre debe tener al menos 2 caracteres']
    },
    descripcion: {
        type: String,
        required: [true, 'Debe ser una cadena de texto y es obligatorio'],
        trim: true,
        maxLength: [500, 'La descripción no puede exceder 500 caracteres'],
        minLength: [10, 'La descripción debe tener al menos 10 caracteres']
    }
}, {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    collection: 'categorias' // Nombre de la colección en MongoDB
});

module.exports = mongoose.model('categorias', SchemaCategoria);

