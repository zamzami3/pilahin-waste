function notFoundHandler(req, res, next) {
  res.status(404).json({
    message: 'Endpoint tidak ditemukan',
    path: req.originalUrl,
  });
}

function errorHandler(err, req, res, next) {
  const status = Number(err?.statusCode) || 500;
  const message = err?.message || 'Terjadi kesalahan pada server';

  if (status >= 500) {
    console.error('[error]', {
      path: req.originalUrl,
      method: req.method,
      message: err?.message,
      stack: err?.stack,
    });
  }

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === 'development' ? { detail: err?.stack } : {}),
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
