const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "mi_clave_secreta"; // Mejor poner en env

// 📌 Login
exports.login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) return res.status(401).json({ error: "Usuario no encontrado" });

    // Suponiendo que la contraseña está en texto plano (para pruebas)
    // En producción usar bcrypt.hash y bcrypt.compare
    if (usuario.password !== password) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Generar token JWT
    const token = jwt.sign({ id: usuario._id, nombre: usuario.nombre }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error del servidor" });
  }
};