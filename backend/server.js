const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const authRoutes = require('./src/routes/authRoutes');
const pickupRoutes = require('./src/routes/pickupRoutes');
const scheduleRoutes = require('./src/routes/scheduleRoutes');
const requestLogger = require('./src/middleware/requestLogger');
const rateLimiter = require('./src/middleware/rateLimiter');
const { notFoundHandler, errorHandler } = require('./src/middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = String(process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(requestLogger);
app.use(rateLimiter({ windowMs: 60 * 1000, maxRequests: 120 }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Origin tidak diizinkan oleh CORS'));
    },
  })
);
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/schedules', scheduleRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Pilahin backend is running' });
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
