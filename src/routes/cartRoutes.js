const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const dbPath = path.join(__dirname, '../database/db.json');

let carts = {}; // Carritos almacenados en memoria

// Función para cargar productos desde `db.json`
function getProductsFromDB() {
    try {
        const data = fs.readFileSync(dbPath, 'utf-8');
        const db = JSON.parse(data);
        return db.products || []; // Asegúrate de que los productos estén bajo la clave "products"
    } catch (error) {
        console.error('Error al leer el archivo de base de datos:', error);
        return [];
    }
}

// Agregar un producto al carrito
router.post('/', verifyToken, (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({ message: 'Datos incompletos.' });
    }

    const products = getProductsFromDB();
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    if (!carts[userId]) carts[userId] = [];

    const existingItem = carts[userId].find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        carts[userId].push({
            productId,
            productName: product.name,
            price: product.price,
            quantity,
        });
    }

    console.log(`Usuario ${userId} agregó el producto ${productId} al carrito.`);
    res.status(201).json({ message: 'Producto agregado al carrito.', cart: carts[userId] });
});

// Obtener el carrito
router.get('/', verifyToken, (req, res) => {
    const userId = req.user.id;
    const userCart = carts[userId] || [];
    res.status(200).json(userCart);
});

// Enviar el carrito para pago
router.post('/checkout', verifyToken, (req, res) => {
    const userId = req.user.id;
    const cart = carts[userId];

    if (!cart || cart.length === 0) {
        return res.status(400).json({ message: 'El carrito está vacío.' });
    }

    res.status(200).json({ cart });
});

module.exports = router;
