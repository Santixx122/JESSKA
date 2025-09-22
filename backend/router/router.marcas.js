const express = require('express');
const router = express.Router()
const controllerMarcas = require('../controller/controller.marcas')
const validatorApiKey = require('../apiKey/apikey')

router.use(validatorApiKey)

router.get('/',controllerMarcas.getMarcas)
router.get('/',controllerMarcas.getMarcasById)
router.post('/',controllerMarcas.insertMarca)
router.put('/:id',controllerMarcas.updateMarca)
router.delete('/:id',controllerMarcas.deleteMarca)

module.exports=router