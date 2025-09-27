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
            .populate('categoriaId', 'nombre')
            .populate('marcaId', 'nombre')
            .sort({ fechaRegistro: -1 });
            
        res.status(200).json({
            success:true,
            message:'Productos encontrados con exito.',
            data:productos
        })
    } catch (error) {
        controlError(res,'Ocurrio un error al encontrar los productos',error)
    }
}

// Obtener solo productos visibles para el catálogo
const getVisibleProducts = async (req,res)=>{
    try {
        const productos = await Producto.find({ 
            visible: true, 
            estado: { $in: ['activo', 'agotado'] } 
        })
            .populate('categoriaId', 'nombre')
            .populate('marcaId', 'nombre')
            .sort({ fechaRegistro: -1 });
            
        res.status(200).json({
            success:true,
            message:'Productos visibles encontrados con exito.',
            data:productos
        })
    } catch (error) {
        controlError(res,'Ocurrio un error al encontrar los productos visibles',error)
    }
}

const getOneProduct = async (req,res)=>{
    try {
        const producto = await Producto.findById(req.params.id)
            .populate('categoriaId', 'nombre')
            .populate('marcaId', 'nombre');

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
         console.log("📩 Body recibido:", req.body);
        const { nombre, descripcion, color, talla, precio, stock, categoriaId, marcaId, estado, visible } = req.body;
        
        // Validaciones básicas
        if (!nombre || !descripcion || !color || !talla || !precio || !stock || !categoriaId || !marcaId) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son obligatorios',
                field: 'general'
            });
        }
        
        const variante = {
            color: color.trim(),
            talla: talla,
            precio: parseFloat(precio),
            stock: parseInt(stock)
        };
        
        const producto = {
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            variante: [variante],
            categoriaId: categoriaId,
            marcaId: marcaId,
            estado: estado || 'activo',
            visible: visible !== undefined ? visible : true
        };
        
        const insertarProducto = await Producto.create(producto);
        const productoCompleto = await Producto.findById(insertarProducto._id)
            .populate('categoriaId', 'nombre')
            .populate('marcaId', 'nombre');
            
        res.status(201).json({
            success:true,
            message:'El producto se creó exitosamente',
            data:productoCompleto
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

// Función para cambiar el estado de visibilidad de un producto
const toggleProductVisibility = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findById(id);
        
        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }
        
        // Cambiar visibilidad
        producto.visible = !producto.visible;
        await producto.save();
        
        const productoActualizado = await Producto.findById(id)
            .populate('categoriaId', 'nombre')
            .populate('marcaId', 'nombre');
        
        res.status(200).json({
            success: true,
            message: `Producto ${producto.visible ? 'mostrado' : 'ocultado'} exitosamente`,
            data: productoActualizado
        });
    } catch (error) {
        controlError(res, 'Error al cambiar la visibilidad del producto', error);
    }
};

module.exports={
    getProducts,
    getVisibleProducts,
    getOneProduct,
    createProducts,
    updateProduct,
    deleteProduct,
    toggleProductVisibility
}