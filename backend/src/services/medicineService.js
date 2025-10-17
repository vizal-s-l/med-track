const { medicineRepository } = require('../repositories/medicineRepository');

const mapFromDb = (medicine) => ({
  id: medicine.id,
  name: medicine.name,
  totalQuantity: medicine.total_quantity,
  currentStock: medicine.current_stock,
  price: medicine.price,
  morning_qty: medicine.morning_qty,
  afternoon_qty: medicine.afternoon_qty,
  night_qty: medicine.night_qty,
  threshold: medicine.threshold,
  nextDue: medicine.next_due,
  notes: medicine.notes,
  created_at: medicine.created_at,
  updated_at: medicine.updated_at,
});

const mapToDb = (payload, userId) => ({
  user_id: userId,
  name: payload.name,
  total_quantity: payload.totalQuantity,
  current_stock: payload.currentStock,
  price: payload.price,
  morning_qty: payload.morning_qty,
  afternoon_qty: payload.afternoon_qty,
  night_qty: payload.night_qty,
  threshold: payload.threshold,
  notes: payload.notes,
});

const calculateDailyDose = (medicine) => {
  const morning = Number(medicine.morning_qty) || 0;
  const afternoon = Number(medicine.afternoon_qty) || 0;
  const night = Number(medicine.night_qty) || 0;
  return morning + afternoon + night;
};

const medicineService = {
  listMedicines: async (user, token) => {
    const medicines = await medicineRepository.listByUser(user.id, token);
    return medicines.map((medicine) => {
      const dailyDose = calculateDailyDose(medicine);
      const currentStock = medicine.current_stock;

      if (dailyDose === 0 || currentStock === null || currentStock === undefined) {
        return mapFromDb(medicine);
      }

      const nextDue = new Date();
      const daysRemaining = Math.floor(currentStock / dailyDose);
      nextDue.setDate(nextDue.getDate() + daysRemaining);

      return {
        ...mapFromDb(medicine),
        nextDue: nextDue.toISOString().split('T')[0],
      };
    });
  },

  createMedicine: async (user, token, payload) => {
    const data = await medicineRepository.create(mapToDb(payload, user.id), token);
    return mapFromDb(data);
  },

  updateMedicine: async (user, token, medicineId, payload) => {
    const data = await medicineRepository.update(
      medicineId,
      user.id,
      mapToDb(payload, user.id),
      token,
    );
    return mapFromDb(data);
  },

  deleteMedicine: async (user, token, medicineId) => {
    await medicineRepository.remove(medicineId, user.id, token);
  },

  adjustStock: async (user, token, medicineId, delta) => {
    const updated = await medicineRepository.adjustStock(medicineId, user.id, delta, token);
    return mapFromDb(updated);
  },

  adjustStockAsJob: async (medicineId, delta) => {
    await medicineRepository.adjustStockWithServiceRole(medicineId, delta);
  },
};

module.exports = {
  medicineService,
  calculateDailyDose,
};
