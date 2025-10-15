// Script temporal para actualizar productos existentes con campo género
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
    genero: {
        type: String,
        enum: ['hombre', 'mujer', 'unisex'],
        default: 'unisex'
    }
}, { collection: 'productos' });

const Producto = mongoose.model('Producto', productoSchema);

// Función para actualizar productos
const updateProductsGenero = async () => {
    try {
        console.log('Iniciando actualización de productos...');
        
        // Buscar productos sin el campo genero
        const productosSinGenero = await Producto.find({ genero: { $exists: false } });
        console.log(`Encontrados ${productosSinGenero.length} productos sin campo género`);
        
        // Actualizar productos sin género
        const result = await Producto.updateMany(
            { genero: { $exists: false } },
            { $set: { genero: 'unisex' } }
        );
        
        console.log(`Actualización completada:`);
        console.log(`- Productos modificados: ${result.modifiedCount}`);
        console.log(`- Productos encontrados: ${result.matchedCount}`);
        
        // Verificar algunos productos de ejemplo y asignar géneros específicos
        const productosEjemplo = await Producto.find().limit(10);
        
        if (productosEjemplo.length > 0) {
            console.log('\nAsignando géneros específicos a productos de ejemplo...');
            
            // Asignar algunos productos como "hombre"
            if (productosEjemplo.length >= 3) {
                await Producto.updateMany(
                    { _id: { $in: productosEjemplo.slice(0, 3).map(p => p._id) } },
                    { $set: { genero: 'hombre' } }
                );
                console.log('- 3 productos asignados como "hombre"');
            }
            
            // Asignar algunos productos como "mujer"
            if (productosEjemplo.length >= 6) {
                await Producto.updateMany(
                    { _id: { $in: productosEjemplo.slice(3, 6).map(p => p._id) } },
                    { $set: { genero: 'mujer' } }
                );
                console.log('- 3 productos asignados como "mujer"');
            }
            
            // El resto se queda como "unisex"
            console.log('- Resto de productos mantienen "unisex"');
        }
        
        // Mostrar resumen final
        const resumen = await Producto.aggregate([
            { $group: { _id: '$genero', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        
        console.log('\nResumen de productos por género:');
        resumen.forEach(item => {
            console.log(`- ${item._id}: ${item.count} productos`);
        });
        
    } catch (error) {
        console.error('Error actualizando productos:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nConexión cerrada. Actualización completada.');
    }
};

// Ejecutar actualización
connectDB().then(updateProductsGenero);