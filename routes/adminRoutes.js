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

// Server-side Express route for updating order status
router.post('/admin/updateOrderStatus/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    res.status(200).json({ orderId, status })
    // try {
    //     // Update order status in the database
    //     const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    //     res.json({ message: 'Order status updated successfully', updatedOrder });
    // } catch (error) {
    //     console.error('Error updating order status:', error);
    //     res.status(500).json({ error: 'Failed to update order status' });
    // }
});


module.exports = router;