const express = require('express')
const router = express.Router()
const controllerDetalle = require('../controller/controller.detallePedidos')
const validatorApiKey = require('../apiKey/apikey')

router.use(validatorApiKey)

router.get('/',controllerDetalle.getDetallesPedidos)
router.get('/:id',controllerDetalle.getDetallePedidoById)
router.post('/',controllerDetalle.createDetallePedido)
router.put('/:id',controllerDetalle.updateDetallePedido)
router.delete('/:id',controllerDetalle.deleteDetallePedido)

module.exports=router