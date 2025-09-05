const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../config/config')
require('dotenv').config()

const URL_BACKEND = config.URL_BACKEND || 'http://localhost:4040'

router.get('/admin',async(req,res)=>{
    try {
        const respuesta = await axios.get(URL_BACKEND+'/admin', {
            headers: {
                'api-key-441': 'contrasena-super-secreta'
            }
        });
        if(!respuesta){
            return res.render('pages/error404',{
                message: 'No se encontraron productos.'
            })
        }else{
            const productos = respuesta.data.data;
            res.render('pages/admin',{
                productos:productos
            })
        }
    } catch (error) {
        res.render('pages/error500',{
            message:'Se presento un error al mostrar los elementos'
        })
    }
})
module.exports = router;
