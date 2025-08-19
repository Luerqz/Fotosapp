const { Schema, model } = require('mongoose');

const fotoSchema = new Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String },
  url: { type: String, required: true },
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  fechaSubida: { type: Date, default: Date.now }
});

module.exports = model('Foto', fotoSchema);