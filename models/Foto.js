const mongoose = require('mongoose');

const FotoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String },
  url: { type: String, required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
}, { timestamps: true });

module.exports = mongoose.model('Foto', FotoSchema);
