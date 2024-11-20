const DBConnection = require('../connection/dbconnection');
const User = require('../models/User');
const authMiddleware = require('../middlewares/auth');

const UsersController = {
    // Registro de usuario
    register: (req, res) => {
        try {
            const { name, email, password, role } = req.body;

            // Leer base de datos
            const db = DBConnection.readDB();

            // Verificar si el usuario ya existe
            if (db.users[email]) {
                return res.status(400).json({ message: 'El usuario ya existe' });
            }

            // Crear nuevo usuario
            const newUser = new User(name, email, password, role);

            // Guardar usuario en la base de datos
            db.users[email] = {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                password: newUser.password, // Guardamos la contraseña hasheada
                role: newUser.role
            };
            DBConnection.writeDB(db);

            // Generar token
            const token = authMiddleware.generateToken(newUser);

            res.status(201).json({ 
                message: 'Usuario registrado exitosamente', 
                user: newUser.toJSON(),
                token 
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Inicio de sesión
    login: (req, res) => {
        try {
            const { email, password } = req.body;

            // Leer base de datos
            const db = DBConnection.readDB();

            // Verificar si el usuario existe
            const userData = db.users[email];
            if (!userData) {
                return res.status(400).json({ message: 'Credenciales inválidas' });
            }

            // Verificar contraseña
            const userInstance = User.fromJSON(userData);

            if (!userInstance.comparePassword(password)) {
                return res.status(400).json({ message: 'Credenciales inválidas' });
            }

            // Generar token
            const token = authMiddleware.generateToken(userData);

            res.json({ 
                message: 'Inicio de sesión exitoso', 
                user: userInstance.toJSON(),
                token 
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = UsersController;