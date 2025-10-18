const { reminderService } = require('../services/reminderService');
const { thresholdService } = require('../services/thresholdService');

const startScheduler = () => {
  if (process.env.DISABLE_SCHEDULER === 'true') {
    console.log('Schedulers disabled via DISABLE_SCHEDULER');
    return;
  }

  reminderService.scheduleReminders();

  if (!process.env.CRON_SECRET) {
    console.warn('CRON_SECRET missing; internal threshold endpoint will be unsecured');
  }

  thresholdService.scheduleThresholdChecks();
};

module.exports = {
  startScheduler,
};
