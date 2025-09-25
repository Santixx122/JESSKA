const express = require('express');
const router = express.Router();
const controller = require('../controller/controller.resenas');
const validatorApiKey = require('../apiKey/apikey');

router.use(validatorApiKey);

router.get('/', controller.getResenas);
router.post('/', controller.createResena);
router.delete('/:id', controller.deleteResena);

module.exports = router;
