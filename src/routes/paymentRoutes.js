const express = require('express');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

let purchaseHistory = {};

router.post('/', verifyToken, (req, res) => {
    const userId = req.user.id;
    const { paymentDetails, cart } = req.body;

    if (!paymentDetails || !cart || cart.length === 0) {
        return res.status(400).json({ message: 'Datos de pago o carrito incompletos.' });
    }

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (total <= 0) {
        return res.status(400).json({ message: 'El carrito está vacío o contiene datos inválidos.' });
    }

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

    res.status(201).json({ message: 'Pago realizado con éxito.', invoice });
});

module.exports = router;
