const express = require('express')
const router = express.Router()
const controllerCliente = require('../controller/controller.clientes')
const validatorApiKey = require('../apiKey/apikey')

router.use(validatorApiKey)

router.get('/',controllerCliente.getClientes)
router.get('/:id',controllerCliente.getClienteById)
router.post('/',controllerCliente.createCliente)
router.put('/:id',controllerCliente.updateCliente)
router.delete('/:id',controllerCliente.deleteCliente)

module.exports=router

