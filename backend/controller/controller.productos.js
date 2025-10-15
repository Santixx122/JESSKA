const Producto = require('../models/productos.model')
const { supabase } = require('../services/supabase');
const mongoose = require('mongoose');
function controlError(res,message,error){
    res.status(500).json({
        success: false,
        message:message,
        error:error.message
    })
}

const getProducts = async (req, res) => {
    try {
        // Obtener query params
        const genero = req.query.genero; // Filtro por género
        
        // Construir el filtro base - solo productos activos
        const filter = {
            estado: 'activo'
        };

        // Aplicar filtro por género si se especifica
        if (genero && ['hombre', 'mujer'].includes(genero)) {
            filter.genero = genero;
        }

        const productos = await Producto.find(filter)
            .populate('categoriaId', 'nombre')
            .populate('marcaId', 'nombre')
            .select('nombre descripcion estado visible variante precio imagenUrl genero')
            .sort({ fechaRegistro: -1 });
            
        res.status(200).json({
            success: true,
            message: 'Productos encontrados con éxito.',
            data: productos
        });
    } catch (error) {
        controlError(res, 'Ocurrió un error al encontrar los productos', error);
    }
};

const getOneProduct = async (req,res)=>{

  try {
    const id = req.params.id
        // 🧩 Validar que sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `El id "${id}" no es válido.`,
      });
    }
        const producto = await Producto.findById(id)
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

    console.log('aquí va la petición: ',req.body, req.file)
    try {
        const { nombre, descripcion, color, talla, precio, stock, categoriaId, marcaId, estado, visible } = req.body;
        
        // Validaciones básicas
        if (!nombre || !descripcion || !color || !talla || !precio || !stock || !categoriaId || !marcaId) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son obligatorios',
                field: 'general'
            });
        }
        
        // Obtener información de la categoría para determinar el género
        const Categoria = require('../models/categorias.model');
        const categoria = await Categoria.findById(categoriaId);
        
        // Determinar género basándose en la categoría
        let genero = 'mujer'; // valor por defecto
        if (categoria && categoria.nombre) {
            const nombreCategoria = categoria.nombre.toLowerCase();
            if (nombreCategoria.includes('hombre') || nombreCategoria.includes('hombres')) {
                genero = 'hombre';
            } else if (nombreCategoria.includes('mujer') || nombreCategoria.includes('mujeres')) {
                genero = 'mujer';
            }
        }
        
        // También verificar el nombre del producto para mayor precisión
        const nombreProducto = nombre.toLowerCase();
        if (nombreProducto.includes('tacones') || 
            nombreProducto.includes('tacón') ||
            nombreProducto.includes('vestido') ||
            nombreProducto.includes('falda') ||
            nombreProducto.includes('blusa')) {
            genero = 'mujer';
        }
        
        if (nombreProducto.includes('corbata') ||
            nombreProducto.includes('traje') ||
            nombreProducto.includes('smoking')) {
            genero = 'hombre';
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
            visible: visible !== undefined ? visible : true,
            genero: genero // Agregar el género determinado automáticamente
        };
        
        // --- Lógica de subida de imagen a Supabase ---
if (req.file) {
    const fileName = `producto-${Date.now()}`;
    const fileBuffer = req.file.buffer;
    const fileMimetype = req.file.mimetype;

    // Subir la imagen al bucket
    const { error: uploadError } = await supabase.storage
        .from('imagenes-productos')
        .upload(fileName, fileBuffer, {
            contentType: fileMimetype,
            upsert: false
        });

    if (uploadError) {
        return controlError(res, 'Error al subir la imagen a Supabase', uploadError);
    }

    // Obtener URL pública
    const { data: { publicUrl } } = supabase
        .storage
        .from('imagenes-productos')
        .getPublicUrl(fileName);

    // Guardar la URL pública como string (compatible con el esquema actual)
    producto.imagenUrl = publicUrl;
}


        const insertarProducto = await Producto.create(producto);
        const productoCompleto = await Producto.findById(insertarProducto._id)
            .populate('categoriaId', 'nombre')
            .populate('marcaId', 'nombre');
            
        res.status(201).json({
            success:true,
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

const getAllProductsAdmin = async (req, res) => {
    try {
        const productos = await Producto.find()
            .populate('categoriaId', 'nombre')
            .populate('marcaId', 'nombre')
            .select('nombre descripcion estado visible variante precio imagenes fechaRegistro')
            .sort({ fechaRegistro: -1 });
            
        res.status(200).json({
            success: true,
            message: 'Productos encontrados con éxito.',
            data: productos
        });
    } catch (error) {
        controlError(res, 'Ocurrió un error al encontrar los productos', error);
    }
};

// Función para actualizar productos existentes con el campo género
const updateProductsGenero = async (req, res) => {
    try {
        // Actualizar todos los productos que no tienen el campo genero
        const result = await Producto.updateMany(
            { genero: { $exists: false } },
            { $set: { genero: 'unisex' } }
        );

        res.status(200).json({
            success: true,
            message: `Se actualizaron ${result.modifiedCount} productos con género por defecto.`,
            data: result
        });
    } catch (error) {
        controlError(res, 'Error al actualizar productos con género', error);
    }
};

module.exports={
    getProducts,
    getOneProduct,
    createProducts,
    updateProduct,
    deleteProduct,
    toggleProductVisibility,
    getAllProductsAdmin,
    updateProductsGenero
}