const Resena = require('../models/resenas.model');

function controlError(res, message, error) {
  res.status(500).json({ success: false, message, error: error.message });
}

const getResenas = async (req, res) => {
  try {
    const filtro = {};
    if (req.query.usuarioId) filtro.usuarioId = req.query.usuarioId;
    const resenas = await Resena.find(filtro).sort({ fecha: -1 });
    res.status(200).json({ success: true, message: 'Reseñas obtenidas', data: resenas });
  } catch (error) { controlError(res, 'Error al obtener reseñas', error); }
};

const createResena = async (req, res) => {
  try {
    const { usuarioId, productoId, calificacion, comentario } = req.body;
    if (!usuarioId || !calificacion) return res.status(400).json({ success: false, message: 'usuarioId y calificacion son obligatorios' });
    const nueva = await Resena.create({ usuarioId, productoId, calificacion, comentario });
    res.status(201).json({ success: true, message: 'Reseña creada', data: nueva });
  } catch (error) { controlError(res, 'Error al crear reseña', error); }
};

const deleteResena = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminada = await Resena.findByIdAndDelete(id);
    if (!eliminada) return res.status(404).json({ success: false, message: 'Reseña no encontrada' });
    res.status(200).json({ success: true, message: 'Reseña eliminada', data: eliminada });
  } catch (error) { controlError(res, 'Error al eliminar reseña', error); }
};

module.exports = { getResenas, createResena, deleteResena };
