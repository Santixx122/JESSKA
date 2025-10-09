// Importamos la función para crear un cliente de Supabase.
const { createClient } = require('@supabase/supabase-js');

// Obtenemos la URL y la clave anónima de las variables de entorno.
// Estas variables las debes añadir a tu archivo .env en la raíz de la carpeta 'backend'.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Creamos y exportamos el cliente de Supabase.
// Este cliente será el que nos permitirá interactuar con el almacenamiento (Storage).
const supabase = createClient(supabaseUrl, supabaseKey);

const initializeBucket = async () => {
    const BUCKET_NAME = 'imagenes-productos';

    try {
        // 1. Verificar si el bucket ya existe.
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        if (listError) {
            console.error('Error al listar buckets de Supabase:', listError.message);
            return;
        }

        const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);

        // 2. Si el bucket no existe, crearlo.
        if (!bucketExists) {
            console.log(`El bucket '${BUCKET_NAME}' no existe. Creándolo...`);
            const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
                public: true, // ¡Importante! Hacer el bucket público.
                fileSizeLimit: '5MB',
                allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
            });

            if (createError) {
                console.error(`Error al crear el bucket '${BUCKET_NAME}':`, createError.message);
            } else {
                console.log(`Bucket '${BUCKET_NAME}' creado y configurado como público.`);
            }
        } else {
            console.log(`El bucket '${BUCKET_NAME}' ya existe.`);
        }

    } catch (error) {
        console.error('Error inesperado durante la inicialización del bucket de Supabase:', error.message);
    }
};

// Exportamos el cliente y la función de inicialización.
module.exports = { supabase, initializeBucket };