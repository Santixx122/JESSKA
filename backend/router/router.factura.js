const express = require('express')
const router = express.Router()
const controllerFactura = require('../controller/controller.facturas')

const validatorApiKey = require('../apiKey/apikey')

router.use(validatorApiKey)

router.get('/',controllerFactura.getFacturas)
router.get('/:id',controllerFactura.getFacturaById)
router.post('/',controllerFactura.createFactura)
router.put('/:id',controllerFactura.updateFactura)
router.delete('/:id',controllerFactura.deleteFactura)

module.exports=router