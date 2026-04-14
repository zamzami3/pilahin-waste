const express = require('express');
const {
  listPickups,
  getPickupHistory,
  createPickup,
  claimPickup,
  completePickup,
  cancelPickup,
} = require('../controllers/pickupController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/lapor', authMiddleware, roleMiddleware('warga'), createPickup);
router.get('/', authMiddleware, roleMiddleware('warga', 'driver', 'admin'), listPickups);
router.get('/history', authMiddleware, roleMiddleware('warga', 'driver', 'admin'), getPickupHistory);
router.put('/claim/:id', authMiddleware, roleMiddleware('driver'), claimPickup);
router.put('/complete/:id', authMiddleware, roleMiddleware('driver'), completePickup);
router.put('/cancel/:id', authMiddleware, roleMiddleware('warga', 'admin'), cancelPickup);

module.exports = router;
