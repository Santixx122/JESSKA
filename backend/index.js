const express = require('express')
require('dotenv').config()
require('./config/connection')
const app = express();
const PORT = process.env.PORT || 4040
const routerProducts = require('./router/router.productos')

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const morgan = require('morgan')
app.use(morgan('dev'))

app.use('/',routerProducts)

app.listen(PORT,()=>{
    console.log(`Servidor Backend funcionando en el puerto ${PORT}`)
})
