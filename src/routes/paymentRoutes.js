const express = require('express');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

let purchaseHistory = {}; // Historial de compras por usuario

// Procesar el pago y generar la factura
router.post('/', verifyToken, (req, res) => {
    const userId = req.user.id;
    const { paymentDetails, cart } = req.body;

    if (!paymentDetails || !cart || cart.length === 0) {
        return res.status(400).json({ message: 'Datos de pago o carrito incompletos.' });
    }

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const invoice = {
        userId,
        date: new Date().toISOString(),
        items: cart.map(item => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
        })),
        total,
    };

    if (!purchaseHistory[userId]) purchaseHistory[userId] = [];
    purchaseHistory[userId].push(invoice);

    res.status(201).json({ message: 'Pago procesado con éxito.', invoice });
});

// Obtener historial de compras
router.get('/history', verifyToken, (req, res) => {
    const userId = req.user.id;
    const history = purchaseHistory[userId] || [];
    res.status(200).json(history);
});

module.exports = router;
