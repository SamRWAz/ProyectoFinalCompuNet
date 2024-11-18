const express = require('express');
const { getAllProducts, getProductById } = require('../controllers/productcontroller');

const router = express.Router();

// Rutas públicas para productos
router.get('/', getAllProducts); // Obtener todos los productos
router.get('/:id', getProductById); // Obtener un producto por ID


module.exports = router;
