const express = require('express');
const router = express.Router();
const Order = require('../model/order');

// Create a new order
router.get('/', (req, res)=>{
  res.send('Happy Order Creation :)') 
})
router.post('/', async (req, res) => {

  try {
    const { itemName, quantity, price } = req.body;
    const userId = req.user._id;

    const order = new Order({ user: userId, itemName, quantity, price });
    await order.save();

    await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get orders for a specific user
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = AS;