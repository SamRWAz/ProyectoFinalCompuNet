const DBConnection = require('../connection/dbconnection');
const Cart = require('../models/Cart');

const CartsController = {
    // Obtener el carrito de un usuario
    getCart: (req, res) => {
        try {
            const db = DBConnection.readDB();
            const userId = req.user.id;

            // Verificar si el usuario tiene un carrito
            const cart = db.carts[userId] || { items: [] };
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Agregar un producto al carrito
    addProduct: (req, res) => {
        try {
            const { productId, quantity } = req.body;
            const db = DBConnection.readDB();
            const userId = req.user.id;

            // Verificar si el producto existe
            const product = db.products[productId];
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Verificar si hay suficiente cantidad disponible
            if (quantity > product.quantity) {
                return res.status(400).json({ message: 'Insufficient stock available' });
            }

            // Obtener el carrito del usuario
            let cart = db.carts[userId];
            if (!cart) {
                cart = new Cart(userId, []);
                db.carts[userId] = cart;
            }

            // Verificar si el producto ya está en el carrito
            const existingItem = cart.items.find(item => item.productId === productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({
                    productId,
                    name: product.name,
                    price: product.price,
                    quantity
                });
            }

            // Actualizar la base de datos
            DBConnection.writeDB(db);
            res.status(200).json({ message: 'Product added to cart', cart });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Actualizar la cantidad de un producto en el carrito
    updateQuantity: (req, res) => {
        try {
            const { productId, quantity } = req.body;
            const db = DBConnection.readDB();
            const userId = req.user.id;

            // Verificar si el carrito existe
            const cart = db.carts[userId];
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            // Buscar el producto en el carrito
            const item = cart.items.find(item => item.productId === productId);
            if (!item) {
                return res.status(404).json({ message: 'Product not found in cart' });
            }

            // Validar la cantidad disponible
            const product = db.products[productId];
            if (quantity > product.quantity) {
                return res.status(400).json({ message: 'Insufficient stock available' });
            }

            // Actualizar la cantidad del producto
            item.quantity = quantity;

            // Guardar cambios en la base de datos
            DBConnection.writeDB(db);
            res.status(200).json({ message: 'Cart updated successfully', cart });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Eliminar un producto del carrito
    removeFromCart: (req, res) => {
        try {
            const { productId } = req.params;
            const db = DBConnection.readDB();
            const userId = req.user.id;

            // Verificar si el carrito existe
            const cart = db.carts[userId];
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            // Filtrar el producto para eliminarlo del carrito
            cart.items = cart.items.filter(item => item.productId !== productId);

            // Guardar cambios en la base de datos
            DBConnection.writeDB(db);
            res.status(200).json({ message: 'Product removed from cart', cart });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = CartsController;
