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
  const { orderId } = req.params;
  try {
      // Fetch the order to ensure it is in a 'pending' state before updating
      const order = await Order.findById(orderId);

      if (!order) {
          return res.status(404).json({ message: 'Order not found' });
      }

      if (order.status !== 'pending') {
          return res.status(403).json({ message: 'Order cannot be edited as it is no longer pending.' });
      }

      // Update the order if it is in the pending state
      const updatedOrder = await Order.findByIdAndUpdate(orderId, {
          senderName: req.body.senderName,
          receiverName: req.body.receiverName,
          destination: req.body.destination,
          pickupStation: req.body.pickupStation,
          packageDetails: req.body.packageDetails
      }, { new: true }); // Return the updated document

      if (updatedOrder) {
          res.json({ message: 'Order updated successfully', order: updatedOrder });
      } else {
          res.status(404).json({ message: 'Order not updated' });
      }
  } catch (error) {
      console.error('Error updating order: ', error);
      res.status(500).json({ message: 'Failed to update order', error: error.message });
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