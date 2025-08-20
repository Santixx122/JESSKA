const Producto = require('../models/productos.model')

function controlError(res,message,error){
    res.status(500).json({
        success: false,
        message:message,
        error:error.message
    })
}

const getProducts = async (req,res)=>{
    try {
        const productos = await Producto.find()
            res.status(201).json({
                success:true,
                message:'Productos encontrados con exito.',
                data:productos
            })
    } catch (error) {
        controlError(res,'Ocurrio un error al encontrar los productos',error)
    }
}

const getOneProduct = async (req,res)=>{
    try {
        const producto = await Producto.findById(req.params.id)

        if(!producto){
            return res.status(404).json({
                success:false,
                message:'No se encontró ningún producto con ese id.'
            })
        }else{
            res.status(200).json({
                success: true,
                message:'Producto encontrado.',
                data: producto
            })
        }
    } catch (error) {
        controlError(res,'Se produjo un error al buscar el producto.',error)
    }
}

const createProducts = async (req,res)=>{
    try {
        const producto={
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            variante: req.body.variante, // Ahora espera un array de variantes
            categoriaId: req.body.categoriaId,
            marcaId: req.body.marcaId,
            estado: req.body.estado || 'activo'
        }
        const insertarProducto = await Producto.create(producto);
        res.status(201).json({
            success:true,
            message:'El producto se creo exitosamente',
            data:insertarProducto
        })
    } catch (error) {
        controlError(res,'El producto no pudo ser creado exitosamente',error)     
    }
}

const updateProduct = async (req,res)=>{
    try {
        const id = req.params.id
        const nuevosDatos = req.body
        const productUpdate = await Producto.findByIdAndUpdate(id,nuevosDatos,{new:true})

        if(!productUpdate)
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
              });
        else
            res.status(200).json({
                success:true,
                message:'Producto actualizado con exito',
                data:productUpdate
            })
    } catch (error) {
        controlError(res,'El producto no se pudo actualizar',error)
    }
}

const deleteProduct = async (req,res)=>{
    try {
        const id = req.params.id
        const productDelete = await Producto.findByIdAndDelete(id)

        if(!productDelete)
            return res.status(404).json({
                success:false,
                message:'El producto a eliminar no fue encontrado',
            });
        res.status(200).json({
            success: true,
            message:'El producto se eliminó con éxito',
            data: productDelete
        })  
    } catch (error) {
        controlError(res,'El producto no se pudo eliminar',error)
    }
}

module.exports={
    getProducts,
    getOneProduct,
    createProducts,
    updateProduct,
    deleteProduct
}
