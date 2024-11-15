const fs = require('fs');
const path = require('path');

// Ruta al archivo JSON para la persistencia
const dbPath = path.join(__dirname, '../database/db.json');

class Product {
    constructor(name, description, price, quantity) {
        if (!name || !description || !price || !quantity) {
            throw new Error('Some fields were left empty, please complete the information.');
        }
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
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

    // Obtener todos los productos
    static getAllProducts() {
        return this.readDB();
    }

    // Obtener un producto por ID
    static getProductById(id) {
        const products = this.readDB();
        return products.find(product => product.id === id);
    }

    // Agregar un nuevo producto
    static addProduct(newProduct) {
        const products = this.readDB();
        const id = String(products.length + 1);
        const product = { id, ...newProduct };
        products.push(product);
        this.writeDB(products);
        return product;
    }

    // Actualizar un producto
    static updateProduct(id, updatedData) {
        const products = this.readDB();
        const index = products.findIndex(product => product.id === id);
        if (index === -1) return null;
        products[index] = { ...products[index], ...updatedData };
        this.writeDB(products);
        return products[index];
    }

    // Eliminar un producto
    static deleteProduct(id) {
        const products = this.readDB();
        const filteredProducts = products.filter(product => product.id !== id);
        if (filteredProducts.length === products.length) return false;
        this.writeDB(filteredProducts);
        return true;
    }
}

module.exports = Product;
