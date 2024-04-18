const express = require('express');
const jwt = require('jsonwebtoken');
// const { passport } = require('../passport/passport').passport;
const Order = require('../models/Order');
const User = require('../models/User');
const { checkAuthenticated } = require('../middleware/authMiddleware');
const { authenticate } = require('../middleware/authmiddlew');
const router = express.Router();

router.get('/dashboard', authenticate, async (req, res) => {
  try {
    // Since the JWT contains 'id', use 'id' instead of '_id'
    const { id: userId } = req.user;
    console.log(userId);
    const orders = await Order.find({ user: userId });
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ user: req.user, orders });
    // res.send('Welcome to the dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/verify-token', authenticate,  (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer Token

  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token is invalid' });
    }
    res.json({ user: decoded });
  });
});


module.exports = router;
