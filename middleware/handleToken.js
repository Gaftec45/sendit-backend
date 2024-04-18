const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username }, // Ensure you have user._id and user.username available
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // Sets the token to expire in 7 days
  );
};

module.exports = {
  generateToken
}; 