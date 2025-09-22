const mongoose = require('mongoose')

// Schema de marcas basado en el schema de MongoDB
const SchemaMarca = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'Debe ser una cadena de texto y es obligatorio'],
        trim: true,
        maxLength: [100, 'El nombre no puede exceder 100 caracteres'],
        minLength: [2, 'El nombre debe tener al menos 2 caracteres']
    }
}, {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    collection: 'marcas' // Nombre de la colección en MongoDB
});

module.exports = mongoose.model('marcas', SchemaMarca);
