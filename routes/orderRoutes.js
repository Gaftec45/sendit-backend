const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { checkAuthenticated } = require('../middleware/authMiddleware');
const { passport } = require('../Passport/passport');
const { authenticate } = require('../middleware/authmiddlew');

router.get('/create-order', checkAuthenticated, (req, res) => {
    res.status(200).json({ message: 'Create Order Form' });
});

router.post('/create-order', authenticate, async (req, res) => {
    try {
        const { senderName, receiverName, destination, pickupStation, packageDetails, status } = req.body;
        const userId = req.user._id;

        const order = new Order({ user: userId, senderName, receiverName, destination, pickupStation, packageDetails, status });
        await order.save();

        await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });

        res.status(201).json({ message: 'Order created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/orders', authenticate, async (req, res) => {
    try {
        const orders = await Order.find().populate('user', '-password');
        res.status(200).json(orders);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
});

router.get('/:orderId', authenticate, async (req, res) => {
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
});

router.put('/:orderId', authenticate, async (req, res) => {
    const orderId = req.params.orderId;
    try {
        const updatedOrder = await Order.findByIdAndUpdate(orderId, req.body, { new: true });

        if (updatedOrder) {
            res.status(200).json({ message: 'Order updated successfully' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:orderId', authenticate, async (req, res) => {
    const orderId = req.params.orderId;
    try {
        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (deletedOrder) {
            res.status(200).json({ message: 'Order deleted successfully' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
















/* const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder } = require('../controllers/orderController');
const { passport } = require('../Passport/passport'); // Import Passport configuration

// Create Order Route with Passport JWT authentication
router.post('/', passport.authenticate('jwt', { session: false }), createOrder);

// Get all Orders Route with Passport JWT authentication
router.get('/', passport.authenticate('jwt', { session: false }), getAllOrders);

// Get Order by ID Route with Passport JWT authentication
router.get('/:orderId', passport.authenticate('jwt', { session: false }), getOrderById); 

// Update Order Route with Passport JWT authentication
router.put('/:orderId', passport.authenticate('jwt', { session: false }), updateOrder);

// Delete Order Route with Passport JWT authentication
router.delete('/:orderId', passport.authenticate('jwt', { session: false }), deleteOrder);

module.exports = router; */