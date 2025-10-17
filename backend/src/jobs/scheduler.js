const { reminderService } = require('../services/reminderService');
const { thresholdService } = require('../services/thresholdService');

const startScheduler = () => {
  if (process.env.DISABLE_SCHEDULER === 'true') {
    console.log('Schedulers disabled via DISABLE_SCHEDULER');
    return;
  }

  reminderService.scheduleReminders();
  thresholdService.scheduleThresholdChecks();
};

module.exports = {
  startScheduler,
};
