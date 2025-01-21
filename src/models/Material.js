const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  documentLink: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Material', MaterialSchema);
