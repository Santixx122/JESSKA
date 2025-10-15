const express = require('express');
const router = express.Router()
const controllerProducts = require('../controller/controller.productos')
const validatorApiKey = require('../apiKey/apikey');
const upload = require('../middleware/upload'); // Importamos nuestro middleware de multer.

router.use(validatorApiKey)

router.get('/admin',controllerProducts.getAllProductsAdmin)

// Ruta temporal para actualizar productos existentes con género
router.post('/update-genero', controllerProducts.updateProductsGenero)

router.get('/',controllerProducts.getProducts)
router.get('/:id',controllerProducts.getOneProduct);
router.post('/', upload.single('imagen'), controllerProducts.createProducts);
router.put('/:id',controllerProducts.updateProduct)
router.patch('/:id/toggle-visibility',controllerProducts.toggleProductVisibility)
router.delete('/:id',controllerProducts.deleteProduct)

module.exports=router
