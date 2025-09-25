const express = require('express');
const router = express.Router()
const controllerProducts = require('../controller/controller.productos')
const validatorApiKey = require('../apiKey/apikey')

router.use(validatorApiKey)

router.get('/',controllerProducts.getProducts)
router.get('/visibles',controllerProducts.getVisibleProducts)
router.get('/destacados',controllerProducts.getVisibleProducts) // Productos destacados son los visibles
router.get('/:id',controllerProducts.getOneProduct)
router.post('/',controllerProducts.createProducts)
router.put('/:id',controllerProducts.updateProduct)
router.patch('/:id/toggle-visibility',controllerProducts.toggleProductVisibility)
router.delete('/:id',controllerProducts.deleteProduct)

module.exports=router

