const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const intakeRoutes = require('./routes/intakeRoutes');
const healthMetricRoutes = require('./routes/healthMetricRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const { authenticateUser } = require('./middlewares/authMiddleware');

const app = express();

app.use(cors({
  origin:
    process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL || 'https://medtrack-frontend.onrender.com'
      : ['http://localhost:8080', 'http://localhost:3000'],
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/medicines', authenticateUser, medicineRoutes);
app.use('/api/intakes', authenticateUser, intakeRoutes);
app.use('/api/health-metrics', authenticateUser, healthMetricRoutes);
app.use('/api/reminders', authenticateUser, reminderRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

module.exports = app;
