const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./src/routes/authRoutes');
const pickupRoutes = require('./src/routes/pickupRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/pickups', pickupRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Pilahin backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
