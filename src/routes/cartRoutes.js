// src/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const cartController = require('../controllers/cartController');

router.get('/', authenticateToken, cartController.getCart);
router.post('/add', authenticateToken, cartController.addToCart);
router.put('/update', authenticateToken, cartController.updateQuantity);
router.delete('/remove/:productId', authenticateToken, cartController.removeFromCart);

module.exports = router;
