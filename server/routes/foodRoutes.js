const express = require('express');
const router = express.Router();
const {
  getFoodItems,
  getFoodItemById,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
} = require('../controllers/foodController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public routes for viewing menu & items
router.get('/', getFoodItems);
router.get('/:id', getFoodItemById);

// Admin-only management routes
router.post('/', protect, adminOnly, createFoodItem);
router.put('/:id', protect, adminOnly, updateFoodItem);
router.delete('/:id', protect, adminOnly, deleteFoodItem);

module.exports = router;
