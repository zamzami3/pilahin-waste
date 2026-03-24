const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        message: 'User tidak terautentikasi',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Akses ditolak: role tidak diizinkan',
      });
    }

    return next();
  };
};

module.exports = roleMiddleware;
