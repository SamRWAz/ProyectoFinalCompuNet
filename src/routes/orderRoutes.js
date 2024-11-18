// src/routes/orderRoutes.js
const express = require('express');
const { createOrder, getAllOrders, getOrderById, getUserOrders } = require('../controllers/ordercontroller');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

// Rutas de pedidos
router.post('/', verifyToken, createOrder); // Crear un nuevo pedido
router.get('/', getAllOrders); // Obtener todos los pedidos
router.get('/:id', getOrderById); // Obtener un pedido específico por ID
router.get('/user/:userId', verifyToken, getUserOrders); // Obtener pedidos de un usuario específico

module.exports = router;

router.get('/history', verifyToken, (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbPath));
    const userOrders = db.orders.filter(order => order.userId === req.user.id);
    res.json(userOrders);
});


