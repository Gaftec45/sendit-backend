const Order = require('../models/Order');
const User = require('../models/User');

// Create Order
const createOrder = async (req, res) => {
  try {
    const { senderName, receiverName, destination, pickupStation, packageDetails } = req.body;
    const userId = req.user._id; // Assuming `req.user` is set by your authentication middleware

    const order = new Order({ 
      user: userId, 
      senderName, 
      receiverName, 
      destination, 
      pickupStation, 
      packageDetails 
    });

    await order.save();
    await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: 'Validation failed', details: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
// Get all Orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', '-password');
    res.status(200).json(orders);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get Order by ID
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId).populate('user', '-password');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update Order
const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const updatedOrder = req.body;
    const order = await Order.findByIdAndUpdate(orderId, updatedOrder, { new: true });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete Order
const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    // Remove the order ID from the user's orders array
    await User.findByIdAndUpdate(order.user, { $pull: { orders: order._id } });
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createOrder,
                  getAllOrders,
                  getOrderById,
                  updateOrder,
                  deleteOrder };