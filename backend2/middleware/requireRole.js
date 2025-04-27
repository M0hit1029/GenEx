module.exports = function requireRole(...allowedRoles) {
    return (req, res, next) => {
      if (!req.user || !allowedRoles.some(r => req.user.roles.includes(r))) {
        return res.status(403).json({ message: 'Forbidden: insufficient privileges' });
      }
      next();
    };
  };