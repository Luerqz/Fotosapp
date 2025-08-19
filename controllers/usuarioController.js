// controllers/usuarioController.js
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Login de usuario (autenticación)
exports.login = async (req, res) => {
  try {
    const { email, clave } = req.body;
    
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });

    const passwordOk = await bcrypt.compare(clave, usuario.clave);
    if (!passwordOk) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener todos los usuarios (sin mostrar contraseña)
exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-clave');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// Obtener usuario por ID (sin mostrar contraseña)
exports.getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-clave');
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' }); 
  }
};

// Crear nuevo usuario
exports.createUsuario = async (req, res) => {
  try {
    const { nombre, email, clave } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(clave, salt);

    const nuevoUsuario = new Usuario({ nombre, email, clave: hash });
    const usuarioGuardado = await nuevoUsuario.save();
    
    res.status(201).json({ ...usuarioGuardado.toObject(), clave: undefined }); // No devolver la clave
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al crear usuario' });
  }
};

// Actualizar usuario
exports.updateUsuario = async (req, res) => {
  try {
    // Hashear contraseña si viene en la actualización
    if (req.body.clave) {
      const salt = await bcrypt.genSalt(10);
      req.body.clave = await bcrypt.hash(req.body.clave, salt);
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-clave'); // No devolver clave

    if (!usuarioActualizado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar usuario' });
  }
};

// Eliminar usuario
exports.deleteUsuario = async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};