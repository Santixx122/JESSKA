const express = require('express')
const app = express()
require('dotenv').config()
const path = require('path')
const PORT = process.env.PORT || 5050
const routerAdmin = require('./router/router.admin')
const routerLanding = require('./router/router.landing');

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'))

app.use(express.static(path.join(__dirname,'public')))


app.use(express.json());

app.use(express.urlencoded({extended:true}))

app.use('/',routerAdmin)
app.use('/',routerLanding);

app.listen(PORT,()=>{
    console.log('servidor Frontend corriendo en el puerto: ',PORT)
})  