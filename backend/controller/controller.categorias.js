const Categoria = require('../models/categorias.model');

function controlError(res,message,error){
    res.status(500).json({
        success:false,
        message:message,
        error:error
    })
}

const getCategoria = async (req,res)=>{
    try {
        const categorias = await Categoria.find()

        return res.status(200).json({
            success:true,
            message:'Las Categorias se encontraron con exito.',
            data:categorias
        })
    } catch (error) {
        controlError(res,'Hubo un error al listar las Categorías.',error)
    }
}

const insertCategoria = async (req,res)=>{
    try {
        const newCategoria = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion
        }
        const insertarCategoria = await Categoria.create(newCategoria)

        res.status(201).json({
            success:true,
            message:'La Categoria se creó exitosamente.',
            data:insertarCategoria
        })
    } catch (error) {
        controlError(res,'No se pudo crear la Categoria.',error)
    }
}

const updateCategoria = async (req,res)=>{
    try {
        const id = req.params.id
        const newCategoria = req.body
        const actualizarCategoria = await Categoria.findByIdAndUpdate(id,newCategoria,{new:true})

        if(!actualizarCategoria){
            return res.status(404).json({
                success:false,
                message:'No se encontró la Categoria.'
            })
        }else{
            res.status(200).json({
                success:true,
                message:'La Categoria se actualizó correctamente.',
                data:actualizarCategoria
            })
        }        
    } catch (error) {
        controlError(res,'No se pudo actualizar la Categoria.',error)
    }
}

const deleteCategoria = async (req,res)=>{
    try {
        const id = req.params.id

        const eliminarCategoria = await Categoria.findByIdAndDelete(id)

        if(!eliminarCategoria){
            return res.status(404).json({
                success:false,
                message:'No se encontró la Categoria a eliminar.'
            })
        }else{
            res.status(200).json({
                success:true,
                message:'Se Eliminó la Categoria correctamente.',
                data:eliminarCategoria
            })
        }
    } catch (error) {
        controlError(res,'Se produjo un error al intentar eliminar la Categoría.',error)
    }
}

module.exports = {
    getCategoria,
    insertCategoria,
    updateCategoria,
    deleteCategoria
}