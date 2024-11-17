const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/db.json'); // Corrige la ruta del archivo JSON
const SECRET_KEY = 'secret123'; // Llave secreta para JWT

const router = express.Router();

router.post('/login', (req, res) => {
    const { email, password, role } = req.body;
    console.log('Datos recibidos:', { email, password, role }); // Depuración

    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const user = db.users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Validar el rol del usuario
    if (user.role !== role) {
        return res.status(403).json({ message: 'Rol incorrecto para este usuario' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, role: user.role }); // Devuelve token y rol al frontend
});



router.post('/register', (req, res) => {
    try {
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }

        const userExists = db.users.some(u => u.email === email);
        if (userExists) {
            return res.status(400).json({ message: 'El correo ya está registrado.' });
        }

        const newUser = {
            id: String(db.users.length + 1),
            name,
            email,
            password,
            role: 'client', // El rol siempre será cliente
        };

        db.users.push(newUser);
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

module.exports = router;
