const express = require('express');
const router = express.Router();
const ProductsController = require('../controllers/productscontroller');
const authMiddleware = require('../middlewares/auth');

router.post('/create', authMiddleware.verifyToken, 
                 authMiddleware.checkRole(['admin']), 
                 ProductsController.create);
router.get('/', ProductsController.allProducts)


module.exports = router;