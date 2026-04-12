const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Default: effectively non-expiring (set JWT_EXPIRES_IN / ADMIN_JWT_EXPIRES_IN only if you want shorter TTL).
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1000y',
  });
};

const generateAdminToken = () => {
  return jwt.sign({ id: 'admin_user' }, JWT_SECRET, {
    expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || '1000y',
  });
};

module.exports = { generateToken, generateAdminToken };
