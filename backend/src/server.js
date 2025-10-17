const app = require('./app');
const { startScheduler } = require('./jobs/scheduler');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log('Connected to Supabase database');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  startScheduler();
});
