const mongoose = require('mongoose');

const schemaMensajes = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usuarios',
    required: [true, 'El ID del usuario es obligatorio']
  },
  contenido: {
    type: String,
    required: [true, 'El contenido del mensaje es obligatorio']
  },
  fecha: {
    type: Date,
    default: Date.now
  }
}, { title: 'esquema de mensajes' });

module.exports = mongoose.model('mensajes', schemaMensajes);
