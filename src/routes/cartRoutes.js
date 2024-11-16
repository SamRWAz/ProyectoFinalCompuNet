const express = require('express');
const { verifyToken, isClient } = require('../middlewares/auth');

const router = express.Router();

// Ruta para agregar un producto al carrito
router.post('/', verifyToken, isClient, (req, res) => {
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({ message: 'ID del producto es obligatorio.' });
    }

    // Aquí puedes agregar lógica para manejar el carrito
    console.log(`Producto agregado al carrito por el cliente: ${req.user.id}`);
    res.status(201).json({ message: 'Producto agregado al carrito' });
});

module.exports = router;
