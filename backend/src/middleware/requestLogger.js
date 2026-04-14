function requestLogger(req, res, next) {
  const startAt = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - startAt;
    const payload = {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs,
      userId: req.user?.id || null,
    };
    console.log('[request]', JSON.stringify(payload));
  });

  next();
}

module.exports = requestLogger;
