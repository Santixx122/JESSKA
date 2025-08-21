require('dotenv').config()

const validadorApiKey = (req,res,next)=>{
    const apiKey = req.headers[process.env.APIKEY_NAME]
    const validApiKey = process.env.APIKEY_PASS


    if(!apiKey)
        
        return res.status(401).json({
            error:'apikey requerida',
            message:'No se ha proporcionado una API key'
    })
    if(apiKey !== validApiKey)
        return res.status(401).json({
            error:'apikey no válida',
            message:'La API key proporcionada no es válida'
        })
    next();
}

module.exports = validadorApiKey;