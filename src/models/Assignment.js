const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  title: { type: String, required: true },
  instructions: { type: String, required: true },
  documentLink: { type: String, required: true }, // Menyimpan tautan dokumen tugas
  deadline: { type: Date, required: false },
  answer: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Referensi ke siswa
      documentLink: { type: String, required: true }, // Tautan dokumen jawaban siswa
      submittedAt: { type: Date, default: Date.now }, // Waktu pengumpulan
    },
  ],
});

module.exports = mongoose.model('Assignment', assignmentSchema);
