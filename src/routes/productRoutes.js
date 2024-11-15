const express = require('express');
const {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productcontroller');

const { verifyToken, isAdmin } = require('../middlewares/auth');
const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', addProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
