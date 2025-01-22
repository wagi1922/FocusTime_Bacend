const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
  async register(req, res) {
    const { username, email, password, birthDate, role } = req.body;
    try {
      // Periksa apakah username atau email sudah terdaftar
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Buat user baru
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        birthDate,
        role,
      });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Bandingkan password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Buat token
      const token = jwt.sign(
        { userId: user._id, role: user.role },process.env.JWT_SECRET,{ expiresIn: '7d' }
      );
  
      res.status(200).json({
        message: 'Login successful',
        data: {
          token,
          role: user.role 
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
  

  async viewProfile(req, res) {
    try {
      // Pastikan userId tersedia dari middleware
      const userId = req.user?.id || req.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const user = await User.findById(userId).select('-password'); // Exclude password
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User profile retrieved successfully', data: user });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = AuthController;
