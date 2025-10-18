const { thresholdRepository } = require('../repositories/thresholdRepository');
const { notificationService } = require('../services/notificationService');

const thresholdController = {
  runThresholdCheck: async () => {
    const lowStockItems = await thresholdRepository.findLowStockMedicines();

    await Promise.all(
      lowStockItems.map(async (item) => {
        if (!item.email) {
          console.warn('Skipping low stock item without email', item);
          return;
        }

        const sent = await notificationService.sendThresholdEmail({
          to: item.email,
          subject: 'Medicine stock running low',
          text: `Medicine ${item.name} is running low. Current stock: ${item.current_stock}. Threshold: ${item.threshold}.`,
        });

        if (sent) {
          await thresholdRepository.markLowStockNotified(item.medicine_id);
        }
      }),
    );
  },
};

module.exports = {
  thresholdController,
};
