const { intakeRepository } = require('../repositories/intakeRepository');
const { reminderService } = require('./reminderService');
const { medicineService } = require('./medicineService');

const intakeService = {
  listIntakes: async (user, token, query) => {
    return intakeRepository.listByUser(user.id, token, query);
  },

  createIntake: async (user, token, payload) => {
    const intake = await intakeRepository.create({ ...payload, user_id: user.id }, token);

    if (payload.status === 'taken' && !intake.stock_adjusted) {
      await medicineService.adjustStock(user, token, intake.medicine_id, -Math.abs(intake.quantity || 0));
      await intakeRepository.markAdjusted(intake.id, user.id, token, true);
    }

    return intake;
  },

  updateIntake: async (user, token, intakeId, payload) => {
    const previous = await intakeRepository.findById(intakeId, user.id, token);
    const updated = await intakeRepository.update(intakeId, user.id, payload, token);

    const quantity = payload.quantity ?? previous.quantity;

    if (payload.status === 'taken') {
      if (!previous.stock_adjusted) {
        await medicineService.adjustStock(user, token, updated.medicine_id, -Math.abs(quantity || 0));
      }
      await intakeRepository.markAdjusted(intakeId, user.id, token, true);
    } else if (payload.status === 'skipped' || payload.status === 'missed') {
      if (previous.stock_adjusted) {
        await medicineService.adjustStock(user, token, updated.medicine_id, Math.abs(quantity || 0));
      }
      await intakeRepository.markAdjusted(intakeId, user.id, token, false);
    }

    return updated;
  },

  generateDailyIntakes: async (user, token, payload) => {
    const result = await reminderService.generateDailyIntakes(user, token, payload);
    return result;
  },
};

module.exports = {
  intakeService,
};
