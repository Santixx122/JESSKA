// Script para actualizar productos 'unisex' a géneros válidos
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

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
    genero: String
}, { collection: 'productos' });

const Producto = mongoose.model('Producto', productoSchema);

// Función para actualizar productos unisex
const updateUnisexProducts = async () => {
    try {
        console.log('Eliminando productos unisex...');
        
        // Buscar productos unisex
        const productosUnisex = await Producto.find({ genero: 'unisex' });
        console.log(`Encontrados ${productosUnisex.length} productos unisex`);
        
        // Actualizar productos unisex a 'mujer' por defecto
        const result = await Producto.updateMany(
            { genero: 'unisex' },
            { $set: { genero: 'mujer' } }
        );
        
        console.log(`Productos unisex actualizados a 'mujer': ${result.modifiedCount}`);
        
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
connectDB().then(updateUnisexProducts);