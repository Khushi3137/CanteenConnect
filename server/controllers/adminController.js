const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');
const User = require('../models/User');

// @desc    Get Admin Dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getAdminDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total orders today
    const totalOrdersToday = await Order.countDocuments({
      createdAt: { $gte: today },
    });

    // Orders by status
    const placedOrders = await Order.countDocuments({ orderStatus: 'Placed' });
    const acceptedOrders = await Order.countDocuments({ orderStatus: 'Accepted' });
    const preparingOrders = await Order.countDocuments({ orderStatus: 'Preparing' });
    const readyOrders = await Order.countDocuments({ orderStatus: 'Ready for Pickup' });
    const completedOrders = await Order.countDocuments({ orderStatus: 'Completed' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'Cancelled' });
    const rejectedOrders = await Order.countDocuments({ orderStatus: 'Rejected' });

    // Pending orders is either Placed or Accepted waiting for preparation
    const pendingOrders = placedOrders + acceptedOrders;

    // Total food items
    const totalFoodItems = await FoodItem.countDocuments();
    const availableFoodItems = await FoodItem.countDocuments({ available: true });

    // Today's revenue (from Completed orders today)
    const todayCompletedOrders = await Order.find({
      orderStatus: 'Completed',
      createdAt: { $gte: today },
    });
    const todayRevenue = todayCompletedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // All-time total revenue
    const allCompletedOrders = await Order.find({ orderStatus: 'Completed' });
    const totalRevenue = allCompletedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Recent 5 orders
    const recentOrders = await Order.find()
      .populate('userId', 'name email studentId')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalOrdersToday,
        pendingOrders,
        placedOrders,
        acceptedOrders,
        preparingOrders,
        readyOrders,
        completedOrders,
        cancelledOrders,
        rejectedOrders,
        totalFoodItems,
        availableFoodItems,
        todayRevenue,
        totalRevenue,
      },
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders with filter & search
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = {};

    // Filter by status if provided and not 'All'
    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    // Search by orderId
    if (search && search.trim() !== '') {
      query.$or = [
        { orderId: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email studentId')
      .sort({ createdAt: -1 });

    // Also support search by student name or studentId in memory if query didn't match directly
    let filteredOrders = orders;
    if (search && search.trim() !== '') {
      const term = search.trim().toLowerCase();
      filteredOrders = orders.filter((ord) => {
        const orderIdMatch = ord.orderId.toLowerCase().includes(term);
        const nameMatch = ord.userId?.name?.toLowerCase().includes(term);
        const emailMatch = ord.userId?.email?.toLowerCase().includes(term);
        const studentIdMatch = ord.userId?.studentId?.toLowerCase().includes(term);
        return orderIdMatch || nameMatch || emailMatch || studentIdMatch;
      });
    }

    res.status(200).json({
      success: true,
      count: filteredOrders.length,
      data: filteredOrders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, notes, paymentStatus } = req.body;

    const allowedStatuses = [
      'Placed',
      'Accepted',
      'Preparing',
      'Ready for Pickup',
      'Completed',
      'Rejected',
      'Cancelled',
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id).populate(
      'userId',
      'name email studentId'
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.orderStatus = status;

    if (notes) {
      order.notes = notes;
    }

    // When status is Completed, mark payment as Paid if cash received
    if (status === 'Completed') {
      order.paymentStatus = 'Paid';
    } else if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to "${status}"`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboardStats,
  getAllOrders,
  updateOrderStatus,
};
