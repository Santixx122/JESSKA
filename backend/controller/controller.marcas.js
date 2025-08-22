const Marca = require('../models/marcas.model')


function controlError(res,message,error){
    res.status(500).json({
        success:false,
        message:message,
        error:error
    })
}

const getMarcas = async (req,res)=>{
    try {
    const marca = await Marca.find()

    res.status(200).json({
        success:true,
        message:'Se encontraron las Marcas exitosamente',
        data:marca
    })
    } catch (error) {
        controlError(res,'No se pudieron cargar las Marcas',error)
    }
}

const getMarcasById = async (req,res)=>{
    try {
        const marcaId = Marca.findById(req.params.id)

        if(!marcaId){
            return res.status(404).json({
                success:false,
                message:'No se encontró ninguna marca por ese id'
            })
        }else{
            res.status(200).json({
                success:true,
                message:'Marca encontrada con exito',
                data:marcaId
            })
        }
    } catch (error) {
        controlError(res,'Ocurrió un error al ejecutar la busqueda',error)
    }
}

const insertMarca = async (req,res)=>{
    try {
        const marca ={
            nombre: req.body.nombre
        }

        const insertarMarca = await Marca.create(marca);

        res.status(201).json({
            success:true,
            message:'La marca se creo exitosamente.',
            data:insertarMarca
        })
    } catch (error) {
        controlError(res,'La marca no se registró exitosamente.',error)
    }
}


const updateMarca = async (req,res)=>{
    try {
        const id = req.params.id
        const nuevaMarca = req.body

        const marcaUpdate = await Marca.findByIdAndUpdate(id,nuevaMarca,{new:true})

        if(!marcaUpdate){
            return res.status(404).json({
                success:false,
                message:'No se encontró la Marca.'
            })
        }else{
            res.status(200).json({
                success:true,
                message:'La Marca se actualizó correctamente.',
                data:marcaUpdate
            })
        }
    } catch (error) {
        controlError(res,'No se pudo actualizar la Marca.',error)
    }
}

const deleteMarca = async (req,res)=>{
    try {
        const id = req.params.id

        const eliminarMarca = await Marca.findByIdAndDelete(id)

        if(!eliminarMarca){
            return res.status(404).json({
                success:false,
                message:'No se encontró la Marca a eliminar.'
            })
        }else{
            res.status(200).json({
                success:true,
                message:'Se Eliminó la Marca correctamente.',
                data:eliminarMarca
            })
        }
    } catch (error) {
        controlError(res,'Se produjo al intentar eliminar la Marca.',error)
    }
}

module.exports={
    getMarcas,
    getMarcasById,
    insertMarca,
    updateMarca,
    deleteMarca
}