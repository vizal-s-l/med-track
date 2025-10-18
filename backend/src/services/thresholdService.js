const nodeCron = require('node-cron');
const { thresholdController } = require('../controllers/thresholdController');

const thresholdService = {
  scheduleThresholdChecks: () => {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    nodeCron.schedule('30 1 * * *', async () => {
      try {
        await thresholdController.runThresholdCheck();
      } catch (error) {
        console.error('Threshold scheduler error:', error);
      }
    }, {
      timezone: process.env.CRON_TIMEZONE || 'UTC',
    });
  },
};

module.exports = {
  thresholdService,
};
