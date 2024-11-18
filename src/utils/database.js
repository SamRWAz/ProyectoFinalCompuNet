const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/db.json');

// Leer datos de la base de datos
function readDatabase() {
    try {
        const data = fs.readFileSync(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer la base de datos:', error);
        throw error;
    }
}

// Escribir datos en la base de datos
function writeDatabase(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 4), 'utf-8');
    } catch (error) {
        console.error('Error al escribir en la base de datos:', error);
        throw error;
    }
}

module.exports = { readDatabase, writeDatabase };
