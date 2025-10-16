const express = require('express');
const morgan = require('morgan');
const cron = require('node-cron');
const backup = require('./config/backup');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require('path');
const { initializeBucket } = require('./services/supabase');

require('dotenv').config();
require('./config/connection');

initializeBucket();

const app = express();

// Middleware
app.use(cookieParser());

// CORS configuration for production
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5050', 'https://jesska-app.onrender.com'];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (como mobile apps o Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'api-key-441']
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
const routerLogin = require('./router/router.login');
const routerMensajes = require('./router/router.mensajes');
const routerResenas = require('./router/router.resenas');

app.use('/productos', routerProducts);
app.use('/pedidos', routerPedido);
app.use('/marcas', routerMarcas);
app.use('/factura', routerfacturas);
app.use('/envios', routerEnvios);
app.use('/detalle', routerDetalle);
app.use('/clientes', routerClientes);
app.use('/categorias', routerCategorias);
app.use('/admin', routerAdmin);
app.use('/usuarios', routerUsuarios);
app.use('/login', routerLogin);
app.use('/mensajes', routerMensajes);
app.use('/resenas', routerResenas);
app.use('/api/orden', require('./router/mercadopago.routes'));


app.listen(PORT,()=>{
    console.log(`Servidor Backend funcionando en el puerto ${PORT}`)
})
/*
cron.schedule('* * * * * *', async () => {
  console.log('Realizando Backup de la Base de datos');
  backup.backupDatabase();
});
*/
