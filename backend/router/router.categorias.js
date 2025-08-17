const express = require('express');
const app = express();
const router = express.Router()
const controllerCategorias = require('../controller/controller.categorias')
const validatorApiKey = require('../apiKey/apikey')


//app.use('/categorias',validatorApiKey)

//router.get('/categorias',controllerCategorias.getCategoria)
//router.post('/categorias',controllerCategorias.insertCategoria)
//router.put('/categorias/:id',controllerCategorias.updateCategoria)
//router.delete('/categorias/:id',controllerCategorias.deleteCategoria)

module.exports=router