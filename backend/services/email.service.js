const nodemailer = require('nodemailer')
require('dotenv').config()
const path = require('path')
const transportador = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.PASS_USER
    }
})
const configEmail = (remitente,destinatario,encabezado,contenido)=>{
    const options ={
        from:remitente,
        to:destinatario,
        subject:encabezado,
        text:contenido,
        attachments:[{
            filename: 'usuarios.metadata.json.gz',
            path: path.join(__dirname,'../backup/JESSKA_DB/usuarios.metadata.json.gz')
        }]
    }
transportador.sendMail(options,(error,options)=>{
    if(error){
        console.log('ERROR: ',error.message)
    }else{
        console.log('Envio exitoso: ',options.response)
    }
})
}


module.exports=configEmail