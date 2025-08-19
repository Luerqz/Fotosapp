const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const usuarioRoutes = require('./routes/usuarios');
const fotoRoutes = require('./routes/fotos');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conectar MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado'))
.catch(err => console.error(err));

// Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/fotos', fotoRoutes);

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));