const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token provided' });
  const parts = header.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Invalid auth header' });
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // we expect token to contain { id, role }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function adminOnly(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'No user' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
  next();
}

module.exports = { authMiddleware, adminOnly };
