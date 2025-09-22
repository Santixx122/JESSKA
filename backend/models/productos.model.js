const mongoose = require('mongoose');

const VarianteSchema = new mongoose.Schema({
    color: {
        type: String,
        required: true,
        trim: true
    },
    talla: {
        type: String,
        required: true,
        enum: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
        trim: true
    },
    precio: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: function(v) {
                return v >= 0;
            },
            message: 'El precio debe ser mayor o igual a 0'
        }
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: function(v) {
                return v >= 0;
            },
            message: 'El stock debe ser mayor o igual a 0'
        }
    }
}, {
    timestamps: false,
    _id: false // No crear _id para subdocumentos
});

// Schema principal del producto
const SchemaProducto = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        maxLength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true,
        maxLength: [500, 'La descripción no puede exceder 500 caracteres'],
        minLength: [10, 'La descripción debe tener al menos 10 caracteres']
    },
    variante: {
        type: [VarianteSchema],
        required: [true, 'Las variantes son obligatorias'],
        validate: {
            validator: function(v) {
                return Array.isArray(v) && v.length > 0;
            },
            message: 'Debe haber al menos una variante del producto'
        }
    },
    fechaRegistro: {
        type: Date,
        required: [true, 'La fecha de registro es obligatoria'],
        default: Date.now
    },
    estado: {
        type: String,
        enum: {
            values: ['activo', 'agotado'],
            message: 'El estado debe ser "activo" o "agotado"'
        },
        default: 'activo'
    },
    categoriaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categorias', // Referencia al modelo de categorías
        required: [true, 'Es obligatorio referenciar la categoría a la que pertenece el producto']
    },
    marcaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'marcas', // Referencia al modelo de marcas
        required: [true, 'Es obligatorio referenciar la marca a la que pertenece el producto']
    }
}, {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    collection: 'productos' // Nombre de la colección en MongoDB
});

// Crear y exportar el modelo
const Producto = mongoose.model('productos', SchemaProducto);
module.exports = Producto;
