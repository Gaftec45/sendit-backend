const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User'); // Ensure the path and file name are correct
const crypto = require('crypto');

function initialize(passport) {
    // Helper function to verify the password
    function verifyPassword(storedPassword, submittedPassword) {
        const hashedSubmittedPassword = crypto.createHash('sha256').update(submittedPassword).digest('hex');
        return storedPassword === hashedSubmittedPassword;
    }

    // Setting up the local strategy
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'No user with that email' });
            }

            // Using the helper function to verify the password
            if (!verifyPassword(user.password, password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            // Check user role and assign a custom message based on role
            return done(null, user, { message: user.role === 'admin' ? 'Admin logged in successfully' : 'User logged in successfully' });
        } catch (error) {
            return done(error);
        }
    }));

    // Serialize the user ID to the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserialize the user from the session using the ID
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
}

module.exports = { passport, initialize };





/* const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const crypto = require('crypto');
const User = require('../models/User');

function initialize(passport) {
  // Local Strategy
  passport.use('local', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    async function(email, password, done) {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: 'No user with that email' });
        }
        const hashedPassword = hashPassword(password);
        if (hashedPassword !== user.password) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return done(null, user, { token });
      } catch (error) {
        return done(error);
      }
    }
  ));

  // JWT Strategy
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  passport.use('jwt', new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

function hashPassword(password) {
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  return hashedPassword;
}

module.exports = {
  passport,
  initialize
};




const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto'); // Import the crypto module
const User = require('../models/User'); // Assuming you have a User model

function initialize(passport) {
  passport.use(new LocalStrategy({
      usernameField: 'email', // Field name for username in the request
      passwordField: 'password' // Field name for password in the request
    },
    async function(email, password, done) {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: 'No user with that email' });
        }
        // Validate the hashed password
        const hashedPassword = hashPassword(password);
        if (hashedPassword !== user.password) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user, { message: 'Login successful' });
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

// Function to hash the password using crypto module
function hashPassword(password) {
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  return hashedPassword;
}

module.exports ={
  passport,
  initialize
}; */
