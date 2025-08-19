const express = require('express')
require('dotenv').config()
require('./config/connection')
const app = express();
const PORT = process.env.PORT || 4040
const routerProducts = require('./router/router.productos')
const routerCategorias = require('./router/router.categorias')
const routerMarcas = require('./router/router.marcas')

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const morgan = require('morgan')
app.use(morgan('dev'))

// Registrar las rutas
app.use('/productos', routerProducts)
app.use('/categorias', routerCategorias)
app.use('/marcas', routerMarcas)

app.listen(PORT,()=>{
    console.log(`Servidor Backend funcionando en el puerto ${PORT}`)
})
