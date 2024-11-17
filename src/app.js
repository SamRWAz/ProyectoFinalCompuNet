const express = require("express");
const path = require("path");
const cors = require("cors");

const userController = require("./controllers/usercontroller"); // Controlador de usuarios
const db = require("./connection/dbconnection"); // Conexión a la base de datos
const productRoutes = require("./routes/productRoutes"); // Rutas de productos
const publicProductRoutes = require("./routes/publicProductRoutes"); // Rutas públicas para productos
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes'); 
const cartRoutes = require('./routes/cartRoutes.js');
const paymentRoutes = require('./routes/paymentRoutes');

const { verifyToken, isAdmin } = require('./middlewares/auth');

const app = express(); // ¡Primero inicializa 'app'!
const port = 5000;

// Middlewares
app.use(express.json()); // Analizar JSON en el cuerpo de las solicitudes
app.use(cors()); // Permitir solicitudes CORS
app.use(express.static(path.join(__dirname, "../public"))); // Archivos estáticos

// Rutas públicas y protegidas
app.use('/api/products', publicProductRoutes); // Rutas públicas
app.use('/api/products/admin', verifyToken, isAdmin, productRoutes); // Rutas protegidas
app.use('/api/users', userRoutes); // Rutas para usuarios
app.use('/api/roles', roleRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);

////////////////////////////////////////////////////////////////////////
//                      Configuración de Rutas                        //
////////////////////////////////////////////////////////////////////////

// Ruta para la base de datos simulada
app.get("/db", (req, res) => {
    const data = db.readDB();
    res.status(200).json({ message: "Here", data });
    console.log(`Nombre: ${data.name}, Edad: ${data.age}`);
});

// Ruta principal para la página de inicio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/views/index.html"));
});

// Ruta para manejar cualquier solicitud no definida (404)
app.get("*", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "../public/views/notfound.html"));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
