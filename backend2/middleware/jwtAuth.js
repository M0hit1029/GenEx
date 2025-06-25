const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async function jwtAuth(req, res, next) {
  console.log('JWT Auth Middleware');
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('-passwordHash');
    req.user_id=payload.sub;
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = { id: user._id, roles: user.roles, tenantId: user.tenantId };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token verification failed' });
  }
};