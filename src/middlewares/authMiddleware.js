const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Opsional, untuk debugging
    // Simpan data user dari token ke req
    req.user = {
      id: decoded.userId, 
      role: decoded.role,
    };
    next();
  } catch (error) {
    console.error('Invalid token error:', error.message); // Logging error
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
