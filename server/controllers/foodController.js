const FoodItem = require('../models/FoodItem');

// @desc    Get all food items with optional search & filter
// @route   GET /api/food
// @access  Public
const getFoodItems = async (req, res, next) => {
  try {
    const { search, category, available } = req.query;
    let query = {};

    // Search by name or description
    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Filter by category
    if (category && category !== 'All' && category.trim() !== '') {
      query.category = category.trim();
    }

    // Filter by availability
    if (available !== undefined && available !== 'All' && available !== '') {
      query.available = available === 'true';
    }

    const foodItems = await FoodItem.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foodItems.length,
      data: foodItems,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single food item by ID
// @route   GET /api/food/:id
// @access  Public
const getFoodItemById = async (req, res, next) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found',
      });
    }

    res.status(200).json({
      success: true,
      data: foodItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new food item
// @route   POST /api/food
// @access  Private/Admin
const createFoodItem = async (req, res, next) => {
  try {
    const { name, description, price, category, image, available } = req.body;

    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, description, price, and category',
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price cannot be negative',
      });
    }

    const foodItem = await FoodItem.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim(),
      image: image || '',
      available: available !== undefined ? Boolean(available) : true,
    });

    res.status(201).json({
      success: true,
      message: 'Food item added successfully',
      data: foodItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update food item
// @route   PUT /api/food/:id
// @access  Private/Admin
const updateFoodItem = async (req, res, next) => {
  try {
    let foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found',
      });
    }

    if (req.body.price !== undefined && Number(req.body.price) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price cannot be negative',
      });
    }

    foodItem = await FoodItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Food item updated successfully',
      data: foodItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete food item
// @route   DELETE /api/food/:id
// @access  Private/Admin
const deleteFoodItem = async (req, res, next) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found',
      });
    }

    await foodItem.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Food item removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFoodItems,
  getFoodItemById,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
};
