const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const Order = require('../models/Order');
const { generateToken } = require('../middleware/authmiddlew');


const home = (req, res) => {
  res.send('Welcome to Our Home Page :)')
}

const dashboard = async (req, res) => {
  try {
    // Since the JWT contains 'id', use 'id' instead of '_id'
    const { id: userId } = req.user;
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
};

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    // Hash the password before saving
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
/*
const login = (req, res, next) => {
  console.log(req.body);
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({
        message: 'Login successful',
        user
      });
    });
  })(req, res, next);
}; */

const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Hash the provided password using SHA-256
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Compare the hashed password with the stored hashed password
    if (hashedPassword !== user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Send token and user information in the response
    res.status(200).json({
      token,
      user: { id: userId, username: user.username } // Customize based on the user info you want to return
    });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

const loogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Hash the provided password using SHA-256
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Compare the hashed password with the stored hashed password
    if (hashedPassword !== user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const isToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5h' });

    // Send token and user information in the response
    res.status(200).json({ isToken, user });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Hash the provided password using SHA-256
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Compare the hashed password with the stored hashed password
    if (hashedPassword !== user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check user role
    if (user.role === 'admin') {
      // If user is an admin, redirect to admin dashboard
      const adminToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5h' });
      return res.status(200).json({ token: adminToken, user });
    } else {
      // If user is not an admin, redirect to user dashboard
      const userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5h' });
      return res.status(200).json({ token: userToken, user });
    }
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};


const logout = (req, res) => {
    // Perform any additional operations before logging out, if needed
    
    // Call req.logout() with a callback function
    req.logout(function(err) {
        if (err) {
            // Handle error, if any
            return res.status(500).json({ error: 'Logout failed. Please try again.' });
        }
        // Logout successful
        return res.status(200).json({ message: 'Logout successful' });
    });
};
/* const logout = (req, res) => {
  req.logout(); // Passport provides this method to log the user out.
  req.session.destroy(); // If you're using sessions, you might want to destroy the session on logout.
  res.status(200).json({ message: 'Logout successful' });
}; */

module.exports = { home, dashboard, signup, login, logout };