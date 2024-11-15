// src/routes/index.js
const express = require('express');
const productRoutes = require('./productRoutes');
const authRoutes = require('./authRoutes');
const orderRoutes = require('./orderRoutes');

const router = express.Router();

router.use('/products', productRoutes);
router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);

module.exports = router;
