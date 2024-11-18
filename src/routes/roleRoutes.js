const express = require('express');
const { verifyToken, isAdmin, isClient } = require('../middlewares/auth');

const router = express.Router();

// Ruta para acciones de administrador
router.post('/admin-action', verifyToken, isAdmin, (req, res) => {
    res.status(200).json({ message: 'Acción de administrador realizada' });
});

// Ruta para acciones de cliente
router.post('/client-action', verifyToken, isClient, (req, res) => {
    res.status(200).json({ message: 'Acción de cliente realizada' });
});



module.exports = router;
