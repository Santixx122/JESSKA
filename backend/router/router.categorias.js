const express = require('express');
const router = express.Router()
const controllerCategorias = require('../controller/controller.categorias')
const validatorApiKey = require('../apiKey/apikey')

router.use(validatorApiKey)

router.get('/categorias',controllerCategorias.getCategoria)
router.get('/:id',controllerCategorias.getCategoriaById)
router.post('/categorias',controllerCategorias.insertCategoria)
router.put('/categorias/:id',controllerCategorias.updateCategoria)
router.delete('/categorias/:id',controllerCategorias.deleteCategoria)

module.exports=router

