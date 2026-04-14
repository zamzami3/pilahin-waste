const express = require('express');
const { register, login, getMe, getMyPointHistory } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', authMiddleware, getMe);
router.get('/me/points', authMiddleware, roleMiddleware('warga', 'admin', 'driver'), getMyPointHistory);

router.get('/admin-only', authMiddleware, roleMiddleware('admin'), (req, res) => {
  res.status(200).json({
    message: 'Selamat datang admin',
  });
});

module.exports = router;
