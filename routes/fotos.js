const express = require('express');
const router = express.Router();
const fotoController = require('../controllers/fotoController');
const authMiddleware = require('../seguridad/auth');

// Obtener fotos
router.get('/fotos', authMiddleware, fotoController.getFotos);

// Subir nueva foto
router.post('/fotos', authMiddleware, fotoController.upload, fotoController.createFoto);

// Editar foto
router.put('/fotos/:id', authMiddleware, fotoController.updateFoto);

// Eliminar foto
router.delete('/fotos/:id', authMiddleware, fotoController.deleteFoto);

module.exports = router;
