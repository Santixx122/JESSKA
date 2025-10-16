const express = require('express')
const app = express()
require('dotenv').config()
const path = require('path')
const PORT = process.env.PORT || 5050
const routerAdmin = require('./router/router.admin')
const routerLanding = require('./router/router.landing');
const routerPerfil = require('./router/router.perfil');
const session = require("express-session");

app.use(session({
  secret: "clave-super-secreta", // cámbiala por algo fuerte
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));


app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'))


app.use(express.static(path.join(__dirname,'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0, 
  etag: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

app.use(express.json());

app.use(express.urlencoded({extended:true}))

app.use('/',routerLanding);
app.use('/',routerPerfil);
app.use('/',routerAdmin)

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).render('pages/error404');
});

// Manejo de errores del servidor
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('pages/error500');
});

app.listen(PORT,()=>{
    console.log('servidor Frontend corriendo en el puerto: ',PORT)
})  