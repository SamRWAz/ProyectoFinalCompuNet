const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/userscontroller');
const authMiddleware = require('../middlewares/auth');

// Ruta de registro
router.post('/register', UsersController.register);

// Ruta de inicio de sesión
router.post('/login', UsersController.login);

module.exports = router;