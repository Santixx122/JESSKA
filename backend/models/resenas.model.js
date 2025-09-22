const mongoose = require('mongoose');

const schemaResenas = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usuarios',
    required: [true, 'El ID del usuario es obligatorio']
  },
  productoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'productos'
  },
  calificacion: {
    type: Number,
    min: [1, 'La calificación mínima es 1'],
    max: [5, 'La calificación máxima es 5'],
    required: [true, 'La calificación es obligatoria']
  },
  comentario: {
    type: String
  },
  fecha: {
    type: Date,
    default: Date.now
  }
}, { title: 'esquema de reseñas' });

module.exports = mongoose.model('resenas', schemaResenas);
