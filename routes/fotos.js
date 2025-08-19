const express = require('express');
const router = express.Router();
const fotoController = require('../controllers/fotoController');
const { verificarToken } = require('../seguridad/auth');

router.post('/', verificarToken, fotoController.upload, fotoController.createFoto);
router.get('/', verificarToken, fotoController.getFotos);

module.exports = router;
