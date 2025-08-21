const express = require('express');
const router = express.Router()
const controllerCategorias = require('../controller/controller.categorias')
const validatorApiKey = require('../apiKey/apikey')

router.use(validatorApiKey)

router.get('/',controllerCategorias.getCategoria)
router.get('/:id',controllerCategorias.getCategoriaById)
router.post('/',controllerCategorias.insertCategoria)
router.put('/:id',controllerCategorias.updateCategoria)
router.delete('/:id',controllerCategorias.deleteCategoria)

module.exports=router

