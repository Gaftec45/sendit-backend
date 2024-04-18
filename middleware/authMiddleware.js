// authMiddleware.js

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

const checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.role === 'admin') {
      return next();
    } else {
      return res.status(403).json({ error: 'Forbidden' });
    }
  }
  res.status(401).json({ error: 'Unauthorized' });
};

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  isAdmin
};