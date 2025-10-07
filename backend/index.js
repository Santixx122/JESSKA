const express = require('express')
const morgan = require('morgan')
const cron = require('node-cron');
const backup = require('./config/backup');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { initializeBucket } = require('./services/supabase');

require('dotenv').config()
require('./config/connection')

initializeBucket();

const app = express();

app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5050",  
  credentials: true               
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(morgan('dev'))

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
const routerLogin = require('./router/router.login')
const routerMensajes = require('./router/router.mensajes')
const routerResenas = require('./router/router.resenas')

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
app.use('/login',routerLogin)
app.use('/mensajes', routerMensajes)
app.use('/resenas', routerResenas)

app.listen(PORT,()=>{
    console.log(`Servidor Backend funcionando en el puerto ${PORT}`)
})
/*
cron.schedule('* * * * * *', async () => {
    console.log('Realizando Backup de la Base de datos');
    backup.backupDatabase();
});

*/