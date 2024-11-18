const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const { getCarts, setCarts } = require('../utils/carts');

const router = express.Router();
let purchaseHistory = {}; // Historial de compras por usuario

router.post('/', verifyToken, (req, res) => {
    const userId = req.user.id;
    const carts = getCarts();

    console.log('Procesando pago para el usuario:', userId);
    console.log('Datos recibidos del cliente:', req.body);

    const { cart, paymentDetails } = req.body;

    if (!cart || cart.length === 0) {
        console.error(`Carrito vacío para el usuario ${userId}`);
        return res.status(400).json({ message: 'El carrito está vacío.' });
    }

    if (!paymentDetails || Object.values(paymentDetails).some(value => !value)) {
        console.error('Datos de pago incompletos para el usuario:', userId);
        return res.status(400).json({ message: 'Datos de pago incompletos.' });
    }

    console.log('Datos del carrito:', cart);
    console.log('Detalles de pago:', paymentDetails);

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

    console.log('Factura generada:', invoice);

    if (!purchaseHistory[userId]) purchaseHistory[userId] = [];
    purchaseHistory[userId].push(invoice);

    res.status(201).json({ message: 'Pago procesado con éxito.', invoice });

    // Limpiar el carrito después de procesar el pago
    delete carts[userId];
    setCarts(carts);
});


router.get('/history', verifyToken, (req, res) => {
    const userId = req.user.id;
    const history = purchaseHistory[userId] || [];
    res.status(200).json(history);
});


module.exports = router;
