const validadorApiKey = (req,res,next)=>{
    const apiKey = req.headers['api-key-441']
    console.log(apiKey)
    const validApiKey = 'contrasena-super-secreta'


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