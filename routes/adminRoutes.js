const express = require('express');
const { passport } = require('../Passport/passport').passport;
const Order = require('../models/Order');
const User = require('../models/User');
const { isAdmin, checkAuthenticated } = require('../middleware/authMiddleware');
const { authenticate } = require('../middleware/authmiddlew');
const router = express.Router();



router.get('/dashboard', async (req, res) => {
    try {
        const admin = req.user; // Assuming this holds the currently logged-in admin
        const usersWithOrders = await User.find({ role: 'user' }).populate('orders').exec();
        res.status(200).json({ admin, users: usersWithOrders });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/users', async (req, res)=> {
    try {
        const admin = req.user; // Assuming this holds the currently logged-in admin
        const usersWithOrders = await User.find({ role: 'user' }).populate('orders').exec();
        res.status(200).json({ admin, users: usersWithOrders });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to handle updating order status
router.post('/orderstatus/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
    const updatedStatus = req.body.status;

    try {
        // Find the order by its ID and update the status
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status: updatedStatus }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // If the order is updated successfully, send back the updated order object
        res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;