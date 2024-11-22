const DBConnection = require('../connection/dbconnection');
const Bill = require('../models/Bill');

const BillsController = {
    pay: (req, res) => {
        try {
            const { products, totalAmount, date } = req.body;
            const userId = req.user.id;

            if (!products || !totalAmount || !date) {
                return res.status(400).json({ message: 'Missing required fields' });
            }


            const db = DBConnection.readDB();

            // Crear una nueva factura
            const bill = new Bill(userId, products, totalAmount, date);
            if (!db.bills) {
                db.bills = [];
            }

            db.bills.push(bill);

            // Restar el stock de los productos comprados
            products.forEach(product => {
                if (db.products[product.productId]) {
                    db.products[product.productId].quantity -= product.quantity;
                }
            });

            // Eliminar el carrito del usuario
            delete db.carts[userId];

            // Guardar cambios en la base de datos
            DBConnection.writeDB(db);

            res.status(201).json({ message: 'Payment processed successfully, cart cleared', bill });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getBills: (req, res) => {
        try {
            const userId = req.user.id;
            const db = DBConnection.readDB();
    
            // Obtener todas las facturas del usuario
            const userBills = db.bills.filter(bill => bill.customer === userId);
    
            res.status(200).json({ bills: userBills });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
};


module.exports = BillsController;
