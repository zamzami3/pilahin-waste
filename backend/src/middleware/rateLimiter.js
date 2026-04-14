function rateLimiter(options = {}) {
  const windowMs = Number(options.windowMs) || 60 * 1000;
  const maxRequests = Number(options.maxRequests) || 120;
  const hits = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const key = `${ip}:${req.path}`;

    const bucket = hits.get(key);
    if (!bucket || now - bucket.windowStart > windowMs) {
      hits.set(key, { windowStart: now, count: 1 });
      return next();
    }

    if (bucket.count >= maxRequests) {
      return res.status(429).json({
        message: 'Terlalu banyak request. Silakan coba lagi beberapa saat.',
      });
    }

    bucket.count += 1;
    hits.set(key, bucket);
    return next();
  };
}

module.exports = rateLimiter;
