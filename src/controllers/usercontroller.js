const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const User = require("./../models/User");
const dbConnection = require("./../database/db");

const UserController = {
    // Obtener un usuario por ID
    get: (req, res) => {
        try {
            const db = dbConnection.readDB();
            const id = parseInt(req.params.id);

            const userGet = db.users.find(user => user.id === id);
            if (!userGet) {
                return res.status(404).json({ success: false, error: "User Not Found" });
            }

            res.status(200).json({ success: true, data: userGet });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    // Crear un nuevo usuario
    create: (req, res) => {
        try {
            const db = dbConnection.readDB();
            const { name, email, role } = req.body;

            if (!name || !email || !role) {
                return res.status(400).json({ success: false, error: "Missing required fields" });
            }

            const newUser = new User(name, email, role);
            newUser.id = db.users.length ? db.users[db.users.length - 1].id + 1 : 1;

            db.users.push(newUser);
            dbConnection.writeDB(db);

            res.status(201).json({ success: true, message: "New User Created", data: newUser });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    // Actualizar un usuario existente
    update: (req, res) => {
        try {
            const db = dbConnection.readDB();
            const id = parseInt(req.params.id);
            const userData = req.body;

            const index = db.users.findIndex(user => user.id === id);

            if (index === -1) {
                return res.status(404).json({ success: false, error: "User Not Found" });
            }

            db.users[index] = { ...db.users[index], ...userData };
            dbConnection.writeDB(db);

            res.status(200).json({ success: true, message: "User Updated", data: db.users[index] });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },

    // Eliminar un usuario
    delete: (req, res) => {
        try {
            const db = dbConnection.readDB();
            const id = parseInt(req.params.id);

            const index = db.users.findIndex(user => user.id === id);

            if (index === -1) {
                return res.status(404).json({ success: false, error: "User Not Found" });
            }

            const deletedUser = db.users.splice(index, 1);
            dbConnection.writeDB(db);

            res.status(200).json({ success: true, message: "User Deleted", data: deletedUser });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
};

module.exports = UserController;
