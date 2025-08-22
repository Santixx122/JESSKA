const express = require('express')
const morgan = require('morgan')

require('dotenv').config()
require('./config/connection')

const app = express();

const PORT = process.env.PORT || 4040

const routerProducts = require('./router/router.productos')
const routerCategorias = require('./router/router.categorias')
const routerMarcas = require('./router/router.marcas')
const routerfacturas = require('./router/router.factura')
const routerPedido = require('./router/router.pedidos')
const routerEnvios = require('./router/router.envios')
const routerDetalle = require('./router/router.detallePedidos')
const routerClientes = require('./router/router.clientes')
const routerAdmin = require('./router/router.admin')
const routerUsuarios = require('./router/router.usuarios');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(morgan('dev'))

// Registrar las rutas
app.use('/productos', routerProducts)
app.use('/pedidos',routerPedido)
app.use('/marcas', routerMarcas)
app.use('/factura',routerfacturas)
app.use('/envios',routerEnvios)
app.use('/detalle',routerDetalle)
app.use('/clientes',routerClientes)
app.use('/categorias', routerCategorias)
app.use('/admin',routerAdmin)
app.use('/usuarios',routerUsuarios)

app.listen(PORT,()=>{
    console.log(`Servidor Backend funcionando en el puerto ${PORT}`)
})
