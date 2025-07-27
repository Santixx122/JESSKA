const express = require('express')
require('dotenv').config()
require('./config/connectrion')
const app = express();
const PORT = process.env.PORT || 4040
const routerProducts = require('./router/router.productos')

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const morgan = require('morgan')
app.use(morgan('dev'))

app.use('/',routerProducts)

app.listen(PORT,()=>{
    console.log(`🚀 El servidor está funcionando en el puerto ${PORT}`)
})
