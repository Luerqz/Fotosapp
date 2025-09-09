const Foto = require('../models/Foto');
const multer = require('multer');
const path = require('path');

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});
exports.upload = multer({ storage }).single('imagen');

// Crear foto
exports.createFoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' });

    const { titulo, descripcion } = req.body;
    const nuevaFoto = new Foto({
      titulo,
      descripcion,
      url: `/uploads/${req.file.filename}`,
      usuario: req.user.id
    });

    const fotoGuardada = await nuevaFoto.save();
    res.status(201).json(fotoGuardada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar la foto' });
  }
};

// Obtener todas las fotos
exports.getFotos = async (req, res) => {
  try {
    const fotos = await Foto.find().populate('usuario', 'nombre email');
    res.json(fotos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener fotos' });
  }
};

// Editar foto

exports.updateFoto = async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;
    const foto = await Foto.findByIdAndUpdate(
      req.params.id,
      { titulo, descripcion },
      { new: true }
    );
    if (!foto) return res.status(404).json({ msg: 'Foto no encontrada' });
    res.json(foto);
  } catch (err) {
    res.status(500).json({ msg: 'Error en el servidor', error: err });
  }
};

// Eliminar foto
exports.deleteFoto = async (req, res) => {
  try {
    const foto = await Foto.findByIdAndDelete(req.params.id);
    if (!foto) return res.status(404).json({ msg: 'Foto no encontrada' });
    res.json({ msg: 'Foto eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ msg: 'Error en el servidor', error: err });
  }
};

exports.updateFoto = async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;
    
    // Encuentra y edita la foto solo si pertenece al usuario autenticado
    const foto = await Foto.findOneAndUpdate(
      { _id: req.params.id, usuario: req.user.id },
      { titulo, descripcion },
      { new: true }
    );

    if (!foto) {
      // Decide si la foto no existe o no pertenece al usuario
      return res.status(404).json({ msg: 'Foto no encontrada o no tienes permiso para editarla' });
    }
    
    res.json(foto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};
