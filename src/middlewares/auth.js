// src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secret123';

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token requerido');

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(401).send('Token inválido');
        req.user = user;
        next();
    });
};


document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            if (data.role === 'admin') window.location.href = '/views/admin.html';
            else window.location.href = '/views/index.html';
        } else {
            alert('Credenciales inválidas');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error en el servidor');
    }
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
            alert('Registro exitoso');
            window.location.href = '/views/login.html';
        } else {
            alert('Error al registrarse');
        }
    } catch (error) {
        console.error('Error al registrarse:', error);
        alert('Error en el servidor');
    }
});

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden realizar esta acción.' });
    }
    next();
};

module.exports = { verifyToken, isAdmin };
