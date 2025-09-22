const express = require('express');
const router = express.Router();
const usuariosController = require('../controller/controller.usuarios')
const logs = require('../services/log')
const validatorApiKey = require('../apiKey/apikey')
const validacionToken = require('../middleware/validacionToken')

// La API key se valida siempre
router.use(validatorApiKey)

// Registro público (no requiere token)
router.post('/', usuariosController.createUsuario);

// Rutas protegidas (requieren token)
//router.use(validacionToken)

router.get('/', usuariosController.getUsuarios);
router.get('/:id', usuariosController.getUsuarioById);
router.put('/:id', usuariosController.updateUsuario);
router.delete('/:id', usuariosController.deleteUsuario);

module.exports = router;