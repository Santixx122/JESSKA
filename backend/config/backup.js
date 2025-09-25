 /* eslint-disable no-unused-vars */
var child_process = require('child_process');
require('dotenv').config();     //process.loadEnvFile()
 
exports.backupDatabase = async () => {
    const outputPath = './backup';

    const command = `mongodump --uri "${process.env.MONGO_URI}" --out ${outputPath} --gzip`;

    await child_process.exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error en el respaldo: ${error.message}`);
            return;
        }
        console.log(`Respaldo completado con éxito ${stdout}`);
    });
};