const express = require("express");
const path = require("path");
const cors = require("cors");

const userController = require("./controllers/usercontroller"); // Controlador de usuarios
const db = require("./connection/dbconnection"); // Conexión a la base de datos
const productRoutes = require("./routes/productRoutes"); // Rutas de productos

const app = express();
const port = 5000;

// Middlewares
app.use(express.json()); // Analizar JSON en el cuerpo de las solicitudes
app.use(cors()); // Permitir solicitudes CORS
app.use(express.static(path.join(__dirname, "../public"))); // Archivos estáticos

////////////////////////////////////////////////////////////////////////
//                      Configuración de Rutas                        //
////////////////////////////////////////////////////////////////////////

// Ruta para la base de datos simulada
app.get("/db", (req, res) => {
    const data = db.readDB();
    res.status(200).json({ message: "Here", data });
    console.log(`Nombre: ${data.name}, Edad: ${data.age}`);
});

// Rutas CRUD para usuarios
app.get("/users/:id", userController.get);
app.post("/users", userController.create);
app.put("/users/:id", userController.update);
app.delete("/users/:id", userController.delete);

// Rutas para productos
app.use('/api/products', productRoutes);

// Ruta principal para la página de inicio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/views/index.html"));
});

// Manejo de solicitudes POST, PUT, PATCH, DELETE en la raíz (demostrativo)
app.post("/", (req, res) => res.status(201).send("Mensaje tipo POST"));
app.put("/", (req, res) => res.status(204).send("Mensaje desde el PUT"));
app.patch("/", (req, res) => res.status(204).send("Mensaje desde el PATCH"));
app.delete("/", (req, res) => res.status(204).send("Mensaje desde el DELETE"));

// Ruta para manejar cualquier solicitud no definida (404)
app.get("*", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "../public/views/notfound.html"));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
