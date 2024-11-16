const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secret123';

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Token requerido' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY); // Verifica el token con la clave secreta
        req.user = decoded; // Agrega la información del usuario al objeto `req`
        next(); // Continúa con la solicitud
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};

// Middleware para verificar si el usuario es administrador
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden realizar esta acción.' });
    }
    next();
};

// Middleware para verificar si el usuario es cliente
const isClient = (req, res, next) => {
    if (req.user.role !== 'client') {
        return res.status(403).json({ message: 'Solo los clientes pueden realizar esta acción.' });
    }
    next();
};

// Exporta todos los middlewares en un solo objeto
module.exports = { verifyToken, isAdmin, isClient };
