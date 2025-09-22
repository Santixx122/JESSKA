const express = require('express')
const router = express.Router()
const controllerEnvios = require('../controller/controller.envios')

const validatorApiKey = require('../apiKey/apikey')

router.use(validatorApiKey)

router.get('/',controllerEnvios.getEnvios)
router.get('/:id',controllerEnvios.getEnvioById)
router.post('/',controllerEnvios.createEnvio)
router.put('/:id',controllerEnvios.updateEnvio)
router.delete('/:id',controllerEnvios.deleteEnvio)

module.exports=router