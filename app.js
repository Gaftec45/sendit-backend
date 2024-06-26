require('dotenv').config();

const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const flash = require('express-flash');
const passport = require('passport');
const bodyParser = require('body-parser');
const { initialize } = require('./Passport/passport');
const cors = require('cors');
const User = require('./models/User');
const URL = process.env.FRONTEND_ORIGIN

const app = express();
const PORT = process.env.PORT || 5000;

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
})); 

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up CORS with dynamic origin if needed
const corsOptions = {
  origin: URL || 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));


// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Custom Passport initialization logic
initialize(passport,
  async id => await User.findById(id),
  async email => await User.findOne({ email }),
  async password => await User.findOne({ password })
);

app.use(flash());

async function connectToMongoDB() {
  try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connected');
  } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
  }
}

// Routes
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dashRoutes = require('./routes/dashRoute');

app.use('/api', authRoutes);
app.use('/user', dashRoutes)
app.use('/api/orders', orderRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res)=>{
  res.send('Hello world')
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

async function startServer() {
  try {
    await connectToMongoDB();
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.error('Error starting server:', error);
    throw error;
  }
}

startServer();