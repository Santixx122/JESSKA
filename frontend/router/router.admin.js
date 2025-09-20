const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const URL_BACKEND = process.env.URL_BACKEND || 'http://localhost:4000';

router.get('/admin',async(req,res)=>{
    try {
        const [resProductos,resUsuarios,resPedidos] = await Promise.all([
            axios.get(`${URL_BACKEND}/productos`,{
            headers:{
                'api-key-441':process.env.APIKEY_PASS
            }
        }),
            axios.get(`${URL_BACKEND}/usuarios`,{
            headers:{
                'api-key-441':process.env.APIKEY_PASS
            }
        }),
            axios.get(`${URL_BACKEND}/pedidos`,{
            headers:{
                'api-key-441':process.env.APIKEY_PASS
            }
        })
    ]);

        const productos= resProductos.data.data
        const usuario= resUsuarios.data.data
        const pedidos = resPedidos.data.data

        res.render('pages/admin',{productos,usuario,pedidos});

    }catch (error) {
        console.error("Error cargando datos:", error.message);
        res.render('pages/error500',{
            message:'Se presento un error al mostrar los elementos'
        });
    }
});

module.exports = router;
