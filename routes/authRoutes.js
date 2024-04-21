require('dotenv').config();
const express = require('express');
const flash = require('express-flash');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const crypto = require('crypto');
const { checkNotAuthenticated } = require('../middleware/authMiddleware');
const { passport } = require('../Passport/passport');
const { generateToken } = require('../middleware/handleToken');


function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// server routes example

router.post('/register', checkNotAuthenticated, async (req, res) => { 
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already in use' });
        }
        const hashedPassword = hashPassword(password);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    failureFlash: true
}), (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
        { id: user._id, role: user.role }, // Example of adding role to the token
        process.env.JWT_SECRET,
        { expiresIn: '5h' }
    );
    res.status(200).json({
        role: user.role,
        token: token,
        userId: user._id,
        user: {
            username: user.username,
            email: user.email,
            userId: user._id,
            // Include any other user details you need, but exclude sensitive data like password
        }
    });
});


router.post('/logout', (req, res) => {
    // This is just a formal endpoint and does not perform real "logout"
    res.status(200).json({ message: 'Please delete your token to logout.' });
});

module.exports = router;













/* const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {checkAuthenticated, checkNotAuthenticated} = require('../middleware/authMiddleware');
const { passport }  = require('../Passport/passport');
const { verifyToken } = require('../middleware/authmiddlew');
const { authenticate } = require('../middleware/authmiddlew');




router.post('/api/signup', checkNotAuthenticated, authController.signup);
router.post('/api/login', checkNotAuthenticated, authController.login);
router.post('/api/logout', authController.logout);
router.get('/', authController.home);

// Protected Page
router.get('/dashboard', authenticate, authController.dashboard); 


/*
router.get('/api/login', (req, res)=>{
    res.render('form', { messages: req.flash('error') });
});

router.post('/api/login', checkNotAuthenticated, passport.authenticate('local', {
    failureRedirect: '/api/login',
    failureFlash: true
}), (req, res) => {
    if (req.user.role === 'admin') {
        res.send('Welcome Admin');
    } else {
        res.redirect('/dashboard');
    }
}); 


module.exports = router; */
