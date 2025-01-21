const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  achievements: [
    {
      title: String,
      progress: Number,
      completed: Boolean,
    },
  ],
});

module.exports = mongoose.model('Achievement', achievementSchema);
