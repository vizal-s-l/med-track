const nodeCron = require('node-cron');
const { thresholdController } = require('../controllers/thresholdController');

const thresholdService = {
  scheduleThresholdChecks: () => {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    nodeCron.schedule('15 2 * * *', async () => {
      try {
        await thresholdController.runThresholdCheck();
      } catch (error) {
        console.error('Threshold scheduler error:', error);
      }
    }, {
      timezone: process.env.CRON_TIMEZONE || 'Asia/Kolkata',
    });
  },
};

module.exports = {
  thresholdService,
};
