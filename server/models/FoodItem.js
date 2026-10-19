const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide food item name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide food description'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Please select category'],
      trim: true,
      default: 'Snacks',
    },
    image: {
      type: String,
      default: '',
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('FoodItem', foodItemSchema);
