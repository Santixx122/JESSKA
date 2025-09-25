const express = require('express');
const router = express.Router();
const controller = require('../controller/controller.mensajes');
const validatorApiKey = require('../apiKey/apikey');

router.use(validatorApiKey);

router.get('/', controller.getMensajes);
router.post('/', controller.createMensaje);
router.delete('/:id', controller.deleteMensaje);

module.exports = router;
