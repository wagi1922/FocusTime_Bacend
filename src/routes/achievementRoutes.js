const express = require('express');
const router = express.Router();
const { getAchievements } = require('../controllers/achievementController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:studentId', getAchievements);

module.exports = router;
