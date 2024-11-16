const express = require('express');
const {
    addProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productcontroller');

const { verifyToken, isAdmin } = require('../middlewares/auth');
const router = express.Router();

// Rutas protegidas para administrar productos
router.post('/', addProduct); // Agregar un nuevo producto
router.put('/:id', updateProduct); // Actualizar un producto
router.delete('/:id', deleteProduct); // Eliminar un producto

module.exports = router;
