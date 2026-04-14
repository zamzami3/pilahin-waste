const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createScheduleRequest,
  listMySchedules,
  listAdminSchedules,
  updateAdminDecision,
  listDriverWeeklyTasks,
  updateDriverTaskStatus,
} = require('../controllers/scheduleController');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('warga'), createScheduleRequest);
router.get('/me', authMiddleware, roleMiddleware('warga'), listMySchedules);

router.get('/admin', authMiddleware, roleMiddleware('admin'), listAdminSchedules);
router.put('/admin/:id/decision', authMiddleware, roleMiddleware('admin'), updateAdminDecision);

router.get('/driver/week', authMiddleware, roleMiddleware('driver'), listDriverWeeklyTasks);
router.put('/driver/:id/status', authMiddleware, roleMiddleware('driver'), updateDriverTaskStatus);

module.exports = router;
