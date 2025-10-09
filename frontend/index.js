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

app.use(express.static(path.join(__dirname,'public')))

app.use(express.json());

app.use(express.urlencoded({extended:true}))

app.use('/',routerLanding);
app.use('/',routerPerfil);
app.use('/',routerAdmin)

app.listen(PORT,()=>{
    console.log('servidor Frontend corriendo en el puerto: ',PORT)
})  