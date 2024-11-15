const fs = require('fs');
const path = require('path');
const dbFilePath = path.join(__dirname, '../database/db.json');

// Leer la base de datos de pedidos
const readOrders = () => JSON.parse(fs.readFileSync(dbFilePath));

// Escribir en la base de datos de pedidos
const writeOrders = (data) => fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));

// Crear un nuevo pedido
const createOrder = (req, res) => {
    const orders = readOrders();
    const newOrder = {
        id: String(orders.length + 1),
        userId: req.body.userId,
        items: req.body.items, // Array de objetos con {productId, quantity}
        total: req.body.total,
        date: new Date().toISOString(),
    };
    orders.push(newOrder);
    writeOrders(orders);
    res.status(201).json(newOrder);
};

// Obtener todos los pedidos
const getAllOrders = (req, res) => {
    const orders = readOrders();
    res.json(orders);
};

// Obtener un pedido específico por ID
const getOrderById = (req, res) => {
    const orders = readOrders();
    const order = orders.find(o => o.id === req.params.id);
    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: "Pedido no encontrado" });
    }
};

// Obtener pedidos de un usuario específico
const getUserOrders = (req, res) => {
    const orders = readOrders();
    const userOrders = orders.filter(o => o.userId === req.params.userId);
    if (userOrders.length > 0) {
        res.json(userOrders);
    } else {
        res.status(404).json({ message: "No se encontraron pedidos para este usuario" });
    }
};

module.exports = { createOrder, getAllOrders, getOrderById, getUserOrders };
