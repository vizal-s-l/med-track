const { createSupabaseClient } = require('../utils/supabaseClient');

const thresholdRepository = {
  findLowStockMedicines: async () => {
    const supabase = createSupabaseClient(undefined, { useServiceRole: true });

    const { data, error } = await supabase
      .rpc('get_low_stock_medicines_with_users');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  markLowStockNotified: async (medicineId) => {
    const supabase = createSupabaseClient(undefined, { useServiceRole: true });

    const { error } = await supabase
      .from('medicines')
      .update({ threshold_notified_at: new Date().toISOString() })
      .eq('id', medicineId);

    if (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = {
  thresholdRepository,
};
