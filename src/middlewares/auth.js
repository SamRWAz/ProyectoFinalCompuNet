const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secret123';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('Encabezado de autorización recibido:', authHeader); // Log para depuración

    const token = authHeader?.split(' ')[1]; // Extrae el token

    if (!token) {
        console.error('Token no proporcionado.');
        return res.status(403).json({ message: 'Token requerido.' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY); // Verifica el token
        console.log('Token verificado. Datos decodificados:', decoded); // Log para depuración
        req.user = decoded; // Agrega la información del usuario al objeto `req`
        next();
    } catch (error) {
        console.error('Error al verificar el token:', error.message);
        res.status(401).json({ message: 'Token inválido.' });
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
