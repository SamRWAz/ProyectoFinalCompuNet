const express = require('express');
const cors = require("cors");
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const productsRoutes = require('./routes/productRoutes')
const cartsRoutes = require('./routes/cartRoutes')
const billsRoutes = require('./routes/billsRoutes')

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de CORS
app.use(cors());

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Middlewares para parsear JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de autenticación
app.use('/auth', authRoutes);
app.use('/products', productsRoutes)
app.use('/cart', cartsRoutes)
app.use('/bills', billsRoutes)


// Rutas para renderizar páginas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

app.get('/login', (req, res) => {
  console.log('Ruta de login accedida');
  console.log('Ruta del archivo:', path.join(__dirname, '../public/views/login.html'));
  res.sendFile(path.join(__dirname, '../public/views/login.html'));
});

app.get('/register', (req, res) => {
  console.log('Ruta de registro accedida');
  console.log('Ruta del archivo:', path.join(__dirname, '../public/views/register.html'));
  res.sendFile(path.join(__dirname, '../public/views/register.html'));
});

app.get('/admin', (req, res) => {
  console.log('Ruta de registro accedida');
  console.log('Ruta del archivo:', path.join(__dirname, '../public/views/admin.html'));
  res.sendFile(path.join(__dirname, '../public/views/admin.html'));
});

app.get('/customer', (req, res) => {
  console.log('Ruta de registro accedida');
  console.log('Ruta del archivo:', path.join(__dirname, '../public/views/customer.html'));
  res.sendFile(path.join(__dirname, '../public/views/customer.html'));
});

app.get('/carts', (req, res) => {
  console.log('Ruta de registro accedida');
  console.log('Ruta del archivo:', path.join(__dirname, '../public/views/cart.html'));
  res.sendFile(path.join(__dirname, '../public/views/cart.html'));
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Algo salió mal', 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;