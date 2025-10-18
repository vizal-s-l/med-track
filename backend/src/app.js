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
const { thresholdController } = require('./controllers/thresholdController');

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

app.post('/api/internal/threshold-check', async (req, res) => {
  try {
    const authHeader = req.headers['x-cron-secret'];
    if (!authHeader || authHeader !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await thresholdController.runThresholdCheck();
    res.status(200).json({ status: 'OK' });
  } catch (error) {
    console.error('Manual threshold check failed:', error);
    res.status(500).json({ error: 'Threshold check failed' });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

module.exports = app;
