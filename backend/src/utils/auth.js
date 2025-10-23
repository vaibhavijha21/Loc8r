const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function createToken(payload) {
  // payload should be small: { id, role }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

module.exports = { hashPassword, comparePassword, createToken };
