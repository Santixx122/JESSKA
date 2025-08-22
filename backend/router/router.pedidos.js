const express = require('express')
const router = express.Router()
const controllerPedido = require('../controller/controller.pedidos')
const validatorApiKey = require('../apiKey/apikey')

router.use(validatorApiKey)

router.get('/',controllerPedido.getPedidos)
router.get('/:id',controllerPedido.getPedidoById)
router.post('/',controllerPedido.createPedido)
router.put('/:id',controllerPedido.updatePedido)
router.delete('/:id',controllerPedido.deletePedido)

module.exports=router