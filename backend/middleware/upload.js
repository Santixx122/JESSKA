const multer = require('multer');

// Configuración del almacenamiento en memoria.
const storage = multer.memoryStorage();

// Filtro para aceptar solo imágenes.
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Aceptar el archivo.
    } else {
        cb(new Error('Tipo de archivo no válido. Solo se aceptan imágenes (jpeg, jpg, png).'), false); // Rechazar el archivo.
    }
};

// Crear la instancia de multer con un límite de tamaño de archivo (ej: 5MB).
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5 MB
    }
});

module.exports = upload;