const express = require('express');
const {
    addProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productcontroller');
const { verifyToken, isAdmin } = require('../middlewares/auth');
const Product = require('../models/Product'); // Importa el modelo Product

const router = express.Router();

// Rutas protegidas para administrar productos
router.post('/', verifyToken, isAdmin, addProduct); // Agregar un nuevo producto
router.put('/:id', verifyToken, isAdmin, updateProduct); // Actualizar un producto
router.delete('/:id', verifyToken, isAdmin, deleteProduct); // Eliminar un producto

// Ruta pública para obtener un producto por ID
router.get('/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.getProductById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});


router.get('/', async (req, res) => {
    try {
        const products = await Product.getAllProducts(); // Método que obtenga los productos
        res.json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});



module.exports = router;
