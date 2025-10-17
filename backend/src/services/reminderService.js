const nodeCron = require('node-cron');
const { intakeRepository } = require('../repositories/intakeRepository');
const { reminderRepository } = require('../repositories/reminderRepository');
const { notificationService } = require('./notificationService');

const addMinutes = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60 * 1000);
};

const DEFAULT_TIMES = {
  morning_time: '08:00:00',
  afternoon_time: '14:00:00',
  night_time: '20:00:00',
  timezone: 'Asia/Kolkata',
};

const reminderService = {
  getSettings: async (user, token) => {
    const settings = await reminderRepository.getSettings(user.id, token);
    return settings || DEFAULT_TIMES;
  },

  upsertSettings: async (user, token, payload) => {
    const data = await reminderRepository.upsertSettings(user.id, token, payload);
    return data;
  },

  registerPushToken: async (user, payload) => {
    const data = await reminderRepository.registerPushToken(user.id, payload);
    return data;
  },

  deletePushToken: async (user, pushTokenId) => {
    await reminderRepository.deletePushToken(user.id, pushTokenId);
  },

  generateDailyIntakes: async (user, token, payload) => {
    return reminderRepository.generateDailyIntakes(user, token, payload, DEFAULT_TIMES);
  },

  scheduleReminders: () => {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    nodeCron.schedule('*/5 * * * *', async () => {
      try {
        const authToken = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!authToken) {
          console.warn('Service role key missing; skipping reminder job');
          return;
        }

        const now = new Date();
        const windowEnd = addMinutes(now, 5);

        const dueIntakes = await reminderRepository.findDueIntakes(now, windowEnd);

        if (dueIntakes.length === 0) {
          return;
        }

        const groupedByUser = dueIntakes.reduce((acc, intake) => {
          acc[intake.user_id] = acc[intake.user_id] || [];
          acc[intake.user_id].push(intake);
          return acc;
        }, {});

        await Promise.all(
          Object.entries(groupedByUser).map(async ([userId, intakes]) => {
            const tokens = await reminderRepository.listPushTokens(userId);

            if (tokens.length === 0) {
              return;
            }

            await notificationService.sendReminderNotifications(tokens, intakes);
            await reminderRepository.markIntakesNotified(intakes.map((i) => i.id));
          }),
        );
      } catch (error) {
        console.error('Reminder scheduler error:', error);
      }
    });
  },
};

module.exports = {
  reminderService,
};
