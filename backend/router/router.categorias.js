const express = require('express');
const app = express();
const router = express.Router()
const controllerCategorias = require('../controller/controller.categorias')
const validatorApiKey = require('../apiKey/apikey')

router.get('/categorias',validatorApiKey,controllerCategorias.getCategoria)
router.post('/categorias',validatorApiKey,controllerCategorias.insertCategoria)
router.put('/categorias/:id',validatorApiKey,controllerCategorias.updateCategoria)
router.delete('/categorias/:id',validatorApiKey,controllerCategorias.deleteCategoria)

module.exports=router