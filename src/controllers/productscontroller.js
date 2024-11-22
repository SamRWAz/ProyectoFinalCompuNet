const DBConnection = require('../connection/dbconnection');
const Product = require('../models/Product');

const ProductsController = {

    allProducts: (req, res) => {
        const db = DBConnection.readDB();
        res.status(200).send(db.products)
        
    },

    create: (req, res) => {
        try {

            const { name, image, price, quantity } = req.body;

            const db = DBConnection.readDB();

            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Only admins can create products' });
            }

            if(!name || !image || !price || !quantity){
                console.log('Incomplete data:', { name, image, price, quantity }); // Para debugging
                return res.status(400).json({ 
                    message: 'All fields are required',
                    received: { name, image, price, quantity } 
                });
            }

            // Validar que el precio sea un número válido
            if (isNaN(price) || price <= 0) {
                return res.status(400).json({ 
                    message: 'The price must be a valid number greater than 0.' 
                });
            }

            const newProduct = new Product(name, image, price, quantity);
            

            db.products[newProduct.id] = {
                id: newProduct.id,
                name: newProduct.name,
                image: newProduct.image,
                price: newProduct.price,
                quantity: newProduct.quantity
            };

            DBConnection.writeDB(db)

            return res.status(200).json({ 
                message: 'Product successfully created',
                newProduct 
            });
            

            
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

}

module.exports = ProductsController;