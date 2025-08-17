const express = require('express');
const app = express();
const router = express.Router()
const controllerProducts = require('../controller/controller.productos')
 const validatorApiKey = require('../apiKey/apikey')



//app.use('/marca',validadorApiKey)


router.get('/admin',controllerProducts.getProducts)
router.post('/',controllerProducts.createProducts)
router.put('/:id',controllerProducts.updateProduct)
router.delete('/:id',controllerProducts.deleteProduct)





module.exports=router