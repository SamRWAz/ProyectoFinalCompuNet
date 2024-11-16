const fs = require('fs');
const path = require('path');

// Ruta al archivo JSON para la persistencia
const dbPath = path.join(__dirname, '../database/db.json');

class Product {

    constructor(name, description, price, quantity, category) {
        if (!name || !description || !price || !quantity || !category) {
            throw new Error('Some fields were left empty, please complete the information.');
        }
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.category = category;
    }

    // Leer datos de la "base de datos"
    static readDB() {
        const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        return data.products;
    }

    // Escribir datos en la "base de datos"
    static writeDB(products) {
        const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        data.products = products;
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    }

    static getAllProducts() {
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        return db.products;
    }

    static getProductById(id) {
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        return db.products.find(product => product.id === id);
    }

    static addProduct(product) {
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

        const newProduct = {
            id: String(db.products.length + 1),
            ...product,
            createdAt: new Date().toISOString(),
        };

        db.products.push(newProduct);
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

        return newProduct;
    }

    static updateProduct(id, updates) {
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        const index = db.products.findIndex(product => product.id === id);

        if (index === -1) return null;

        db.products[index] = { ...db.products[index], ...updates };
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

        return db.products[index];
    }

    static deleteProduct(id) {
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        const index = db.products.findIndex(product => product.id === id);

        if (index === -1) return false;

        db.products.splice(index, 1);
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

        return true;
    }
}

module.exports = Product;