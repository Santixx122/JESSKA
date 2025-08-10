const mongoose = require('mongoose');

const schemaCategoria = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    productos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto'
    }]
});

module.exports = mongoose.model('Categoria', schemaCategoria);
