const express = require('express');
const {
  createPickup,
  claimPickup,
  completePickup,
} = require('../controllers/pickupController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/lapor', authMiddleware, roleMiddleware('warga'), createPickup);
router.put('/claim/:id', authMiddleware, roleMiddleware('driver'), claimPickup);
router.put('/complete/:id', authMiddleware, roleMiddleware('driver'), completePickup);

module.exports = router;
