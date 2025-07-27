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



const createProducts = async (req,res)=>{
    try {
        const producto={
            referencia:req.body.referencia,
            marca:req.body.marca,
            nombre:req.body.nombre,
            descripcion:req.body.descripcion,
            precio:req.body.precio,
            cantidad:req.body.cantidad
        }
        const insertarProducto = await Producto.create(producto);
        res.status(200).json({
            success:true,
            message:'El producto se cre exitosamente',
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
        controlError(res,'El prodcuto no se pudo actualizar',error)
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
        controllError(res,'El producto no se pudo eliminar',error)
    }
}
module.exports={
    getProducts,
    createProducts,
    updateProduct,
    deleteProduct
}