const Mensaje = require('../models/mensajes.model');

function controlError(res, message, error) {
  res.status(500).json({ success: false, message, error: error.message });
}

const getMensajes = async (req, res) => {
  try {
    const filtro = {};
    if (req.query.usuarioId) filtro.usuarioId = req.query.usuarioId;
    const mensajes = await Mensaje.find(filtro).sort({ fecha: -1 });
    res.status(200).json({ success: true, message: 'Mensajes obtenidos', data: mensajes });
  } catch (error) { controlError(res, 'Error al obtener mensajes', error); }
};

const createMensaje = async (req, res) => {
  try {
    const { usuarioId, contenido } = req.body;
    if (!usuarioId || !contenido) return res.status(400).json({ success: false, message: 'usuarioId y contenido son obligatorios' });
    const nuevo = await Mensaje.create({ usuarioId, contenido });
    res.status(201).json({ success: true, message: 'Mensaje creado', data: nuevo });
  } catch (error) { controlError(res, 'Error al crear mensaje', error); }
};

const deleteMensaje = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Mensaje.findByIdAndDelete(id);
    if (!eliminado) return res.status(404).json({ success: false, message: 'Mensaje no encontrado' });
    res.status(200).json({ success: true, message: 'Mensaje eliminado', data: eliminado });
  } catch (error) { controlError(res, 'Error al eliminar mensaje', error); }
};

module.exports = { getMensajes, createMensaje, deleteMensaje };
