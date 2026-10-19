const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');
const generateOrderId = require('../utils/generateOrderId');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Student)
const createOrder = async (req, res, next) => {
  try {
    const { items, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item',
      });
    }

    // Verify all items and check availability
    const orderItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      if (!item.foodItemId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid item or quantity specified',
        });
      }

      const food = await FoodItem.findById(item.foodItemId);
      if (!food) {
        return res.status(404).json({
          success: false,
          message: `Food item with ID ${item.foodItemId} not found`,
        });
      }

      if (!food.available) {
        return res.status(400).json({
          success: false,
          message: `"${food.name}" is currently unavailable for order`,
        });
      }

      const subtotal = food.price * Number(item.quantity);
      calculatedTotal += subtotal;

      orderItems.push({
        foodItem: food._id,
        name: food.name,
        price: food.price,
        quantity: Number(item.quantity),
        subtotal,
      });
    }

    const orderId = generateOrderId();

    const order = await Order.create({
      orderId,
      userId: req.user._id,
      items: orderItems,
      totalAmount: calculatedTotal,
      orderStatus: 'Placed',
      paymentMethod: 'Cash on Pickup',
      paymentStatus: 'Pending',
      notes: notes || '',
    });

    const populatedOrder = await Order.findById(order._id).populate(
      'userId',
      'name email studentId'
    );

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: populatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private (Student)
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('userId', 'name email studentId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order details by id or orderId
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if id is ObjectId or custom orderId string
    let order;
    if (id.startsWith('ORD-')) {
      order = await Order.findOne({ orderId: id }).populate(
        'userId',
        'name email studentId'
      );
    } else {
      order = await Order.findById(id).populate(
        'userId',
        'name email studentId'
      );
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check authorization: must be the student who placed it, or an admin
    if (
      order.userId._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (only allowed if status is 'Placed')
// @route   PUT /api/orders/:id/cancel
// @access  Private (Student)
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify ownership
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own orders',
      });
    }

    // Constraint: Can only cancel if orderStatus is 'Placed'
    if (order.orderStatus !== 'Placed') {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already '${order.orderStatus}'`,
      });
    }

    order.orderStatus = 'Cancelled';
    order.notes = req.body.reason ? `Cancelled by student: ${req.body.reason}` : 'Cancelled by student';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};
