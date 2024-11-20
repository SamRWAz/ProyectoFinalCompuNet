const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const productController = require('../controllers/productController');

// Rutas para productos
router.get('/', productController.getAllProducts); // Obtener todos los productos
router.post('/', authenticateToken, isAdmin, productController.createProduct);

module.exports = router;


