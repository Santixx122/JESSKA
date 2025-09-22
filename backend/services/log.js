const { error } = require('console');
const fs = require('fs')
const path = require('path')

exports.generateLog = (filename, logData)=>{

    const filePath = path.join(__dirname, '../logs', filename);

    fs.appendFile(filePath, logData + "\n", (err)=>{

        if(err) {
            throw new error('Hubo un error al hacer el log: ', err.message)
        }else{
        console.log('Log saved');

        }
    })
}

