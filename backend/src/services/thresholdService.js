const nodeCron = require('node-cron');
const { thresholdRepository } = require('../repositories/thresholdRepository');
const { notificationService } = require('./notificationService');

const thresholdService = {
  scheduleThresholdChecks: () => {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    nodeCron.schedule('0 7 * * *', async () => {
      try {
        const lowStockItems = await thresholdRepository.findLowStockMedicines();

        await Promise.all(
          lowStockItems.map(async (item) => {
            if (!item.email) {
              return;
            }

            await notificationService.sendThresholdEmail({
              to: item.email,
              subject: 'Medicine stock running low',
              text: `Medicine ${item.name} is running low. Current stock: ${item.current_stock}. Threshold: ${item.threshold}.`,
            });

            await thresholdRepository.markLowStockNotified(item.medicine_id);
          }),
        );
      } catch (error) {
        console.error('Threshold scheduler error:', error);
      }
    });
  },
};

module.exports = {
  thresholdService,
};
