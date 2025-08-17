const express = require('express');
const app = express();
const router = express.Router()
const controllerMarcas = require('../controller/controller.marcas')
//const validatorApiKey = require('../apiKey/apikey')


const validatorApiKey = (req,res,next)=>{
    const apiKey = req.headers['api-key-441'];
    console.log(apiKey);
    const validApiKey = 'contrasena-super-secreta';


    if(!apiKey){
        return res.status(401).json({
            error:'apikey requerida',
            message:'No se ha proporcionado una API key'
    })}
    if(apiKey !== validApiKey){
        return res.status(401).json({
            error:'apikey no válida',
            message:'La API key proporcionada no es válida'
        })
    }
    next();
}

//app.use('/marcas',validatorApiKey)

router.get('/marcas',controllerMarcas.getMarcas)
//router.post('/marcas',controllerCategorias.insertCategoria)
//router.put('/marcas/:id',controllerCategorias.updateCategoria)
//router.delete('/marcas/:id',controllerCategorias.deleteCategoria)


module.exports=router