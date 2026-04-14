const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      message: 'JWT_SECRET belum dikonfigurasi di environment',
    });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Token tidak ditemukan',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token tidak valid atau kedaluwarsa',
      error: error.message,
    });
  }
};

module.exports = authMiddleware;
