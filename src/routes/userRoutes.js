const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/database.json');
const SECRET_KEY = 'secret123';

const router = express.Router();

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const db = JSON.parse(fs.readFileSync(dbPath));
    const user = db.users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, role: user.role });
});

module.exports = router;


router.post('/register', (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbPath));
    const newUser = { id: String(db.users.length + 1), role: 'client', ...req.body };

    db.users.push(newUser);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    res.status(201).json(newUser);
});
