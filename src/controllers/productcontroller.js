const Product = require('../models/Product');

const getAllProducts = (req, res) => {
    try {
        const products = Product.getAllProducts(); // Leer productos del modelo
        res.status(200).json(products); // Enviar productos como respuesta
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error interno al obtener productos' });
    }
};


const getProductById = (req, res) => {
    const productId = req.params.id;

    try {
        const product = Product.getProductById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error al obtener detalles del producto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Controlador para agregar un nuevo producto
const addProduct = (req, res) => {
    try {
        const newProduct = req.body;
        const addedProduct = Product.addProduct(newProduct);
        res.status(201).json(addedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controlador para actualizar un producto
const updateProduct = (req, res) => {
    const updatedProduct = Product.updateProduct(req.params.id, req.body);
    if (updatedProduct) {
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
};

// Controlador para eliminar un producto
const deleteProduct = (req, res) => {
    const success = Product.deleteProduct(req.params.id);
    if (success) {
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
};
