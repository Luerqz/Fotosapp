const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verificarToken } = require('../seguridad/auth');

// Rutas protegidas
router.get('/', verificarToken, usuarioController.getUsuarios);
router.get('/:id', verificarToken, usuarioController.getUsuarioById);
router.put('/:id', verificarToken, usuarioController.updateUsuario);
router.delete('/:id', verificarToken, usuarioController.deleteUsuario);

// Rutas públicas
router.post('/', usuarioController.createUsuario);  // Registro
router.post('/login', usuarioController.login);     // Login

module.exports = router;