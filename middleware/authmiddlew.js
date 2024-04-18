const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  console.log('Authenticating...');
  
  // Retrieve the token from local storage
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded:', decoded);

    // Check if the token is expired
    if (decoded.exp <= Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ error: 'Token has expired' });
    }

    req.user = decoded;
    next();
    console.log(req.user);
  } catch (err) {
    console.error('JWT Error:', err);
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = { authenticate };


/* const generateToken = (user) => {
  
  const userId = user._id;
  return jwt.sign(
    { id: userId, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d'});
};

// Middleware to authenticate JWT tokens
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user;
    next();
  });
}; */