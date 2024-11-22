// src/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const CartsController = require('../controllers/cartscontroller')
const authMiddleware = require('../middlewares/auth')


router.get('/', authMiddleware.verifyToken, CartsController.getCart);
router.post('/add', authMiddleware.verifyToken, CartsController.addProduct);
router.put('/update', authMiddleware.verifyToken, CartsController.updateQuantity);
router.delete('/remove/:productId', authMiddleware.verifyToken, CartsController.removeFromCart);

module.exports = router;
