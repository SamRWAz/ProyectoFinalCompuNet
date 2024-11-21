const jwt = require('jsonwebtoken');

// Clave secreta para firmar JWT (deberías guardarla en variables de entorno)
const SECRET_KEY = 'tu_clave_secreta_muy_segura';

const authMiddleware = {
    // Generar token JWT
    generateToken: (user) => {
        return jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role 
            }, 
            SECRET_KEY, 
            { expiresIn: '1h' }
        );
    },

    // Middleware para verificar token
    verifyToken: (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No se proporcionó token' });
        }

        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    },

    // Middleware para verificar rol de usuario
    checkRole: (roles) => {
        return (req, res, next) => {
            if (!req.user || !roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Acceso denegado' });
            }
            next();
        };
    }
};

module.exports = authMiddleware;