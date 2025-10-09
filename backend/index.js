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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: true, 
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rutas
const routerProducts = require('./router/router.productos');
const routerCategorias = require('./router/router.categorias');
const routerMarcas = require('./router/router.marcas');
const routerfacturas = require('./router/router.factura');
const routerPedido = require('./router/router.pedidos');
const routerEnvios = require('./router/router.envios');
const routerDetalle = require('./router/router.detallePedidos');
const routerClientes = require('./router/router.clientes');
const routerAdmin = require('./router/router.admin');
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

// Ruta para renderizar vistas EJS directamente
app.get('/', (req, res) => {
  res.render('landing');
});

// Puerto
const PORT = process.env.PORT || 4040;
app.listen(PORT, () => {
  console.log(`Servidor Backend funcionando en el puerto ${PORT}`);
});

// Cron opcional (desactivado por ahora)
/*
cron.schedule('* * * * * *', async () => {
  console.log('Realizando Backup de la Base de datos');
  backup.backupDatabase();
});
*/
