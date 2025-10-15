// Script mejorado para actualizar productos con género basado en categorías
const mongoose = require('mongoose');
require('dotenv').config();

// Conectar a la base de datos
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jesska');
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        process.exit(1);
    }
};

// Esquema de productos (simplificado para la actualización)
const productoSchema = new mongoose.Schema({
    nombre: String,
    descripcion: String,
    categoriaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria'
    },
    genero: {
        type: String,
        enum: ['hombre', 'mujer', 'unisex'],
        default: 'unisex'
    }
}, { collection: 'productos' });

// Esquema de categorías
const categoriaSchema = new mongoose.Schema({
    nombre: String
}, { collection: 'categorias' });

const Producto = mongoose.model('Producto', productoSchema);
const Categoria = mongoose.model('Categoria', categoriaSchema);

// Función para actualizar productos basándose en categorías
const updateProductsGeneroInteligente = async () => {
    try {
        console.log('Iniciando actualización inteligente de productos...');
        
        // Obtener todos los productos con sus categorías pobladas
        const productos = await Producto.find().populate('categoriaId');
        console.log(`Encontrados ${productos.length} productos total`);
        
        let actualizacionesHombre = 0;
        let actualizacionesMujer = 0;
        let actualizacionesUnisex = 0;
        
        for (const producto of productos) {
            let nuevoGenero = 'unisex'; // default
            
            // Determinar género basándose en la categoría
            if (producto.categoriaId && producto.categoriaId.nombre) {
                const nombreCategoria = producto.categoriaId.nombre.toLowerCase();
                
                if (nombreCategoria.includes('hombre') || nombreCategoria.includes('hombres')) {
                    nuevoGenero = 'hombre';
                } else if (nombreCategoria.includes('mujer') || nombreCategoria.includes('mujeres')) {
                    nuevoGenero = 'mujer';
                }
            }
            
            // También verificar el nombre del producto para mayor precisión
            const nombreProducto = producto.nombre.toLowerCase();
            if (nombreProducto.includes('tacones') || 
                nombreProducto.includes('tacón') ||
                nombreProducto.includes('vestido') ||
                nombreProducto.includes('falda') ||
                nombreProducto.includes('blusa')) {
                nuevoGenero = 'mujer';
            }
            
            if (nombreProducto.includes('corbata') ||
                nombreProducto.includes('traje') ||
                nombreProducto.includes('smoking')) {
                nuevoGenero = 'hombre';
            }
            
            // Actualizar el producto
            await Producto.findByIdAndUpdate(producto._id, { genero: nuevoGenero });
            
            console.log(`${producto.nombre} -> ${nuevoGenero} (categoría: ${producto.categoriaId?.nombre || 'sin categoría'})`);
            
            // Contadores
            if (nuevoGenero === 'hombre') actualizacionesHombre++;
            else if (nuevoGenero === 'mujer') actualizacionesMujer++;
            else actualizacionesUnisex++;
        }
        
        console.log('\n=== RESUMEN DE ACTUALIZACIÓN ===');
        console.log(`Productos asignados como HOMBRE: ${actualizacionesHombre}`);
        console.log(`Productos asignados como MUJER: ${actualizacionesMujer}`);
        console.log(`Productos asignados como UNISEX: ${actualizacionesUnisex}`);
        
        // Verificar resultado final
        const resumen = await Producto.aggregate([
            { $group: { _id: '$genero', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        
        console.log('\n=== DISTRIBUCIÓN FINAL ===');
        resumen.forEach(item => {
            console.log(`${item._id.toUpperCase()}: ${item.count} productos`);
        });
        
    } catch (error) {
        console.error('Error actualizando productos:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nConexión cerrada. Actualización completada.');
    }
};

// Ejecutar actualización
connectDB().then(updateProductsGeneroInteligente);