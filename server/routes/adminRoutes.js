const express = require('express');
const router = express.Router();
const {
  getAdminDashboardStats,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

router.get('/dashboard', getAdminDashboardStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
