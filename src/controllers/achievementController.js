const Achievement = require('../models/Achievement');

exports.getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ studentId: req.params.studentId });
    res.status(200).json({ studentId: req.params.studentId, achievements });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
