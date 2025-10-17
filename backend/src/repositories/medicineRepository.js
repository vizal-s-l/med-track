const { createSupabaseClient } = require('../utils/supabaseClient');

const withUserClient = (token) => createSupabaseClient(token);
const withServiceClient = () => createSupabaseClient(undefined, { useServiceRole: true });

const medicineRepository = {
  listByUser: async (userId, token) => {
    const supabase = withUserClient(token);

    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  findById: async (medicineId, userId, token) => {
    const supabase = withUserClient(token);

    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('id', medicineId)
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  create: async (payload, token) => {
    const supabase = withUserClient(token);

    const { data, error } = await supabase.from('medicines').insert([payload]).select().single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  update: async (medicineId, userId, payload, token) => {
    const supabase = withUserClient(token);

    const { data, error } = await supabase
      .from('medicines')
      .update(payload)
      .eq('id', medicineId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  adjustStock: async (medicineId, userId, delta, token) => {
    const supabase = withUserClient(token);

    const { data: current, error: fetchError } = await supabase
      .from('medicines')
      .select('id, current_stock')
      .eq('id', medicineId)
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    const nextStock = Math.max(0, (current.current_stock || 0) + delta);

    const { data, error } = await supabase
      .from('medicines')
      .update({
        current_stock: nextStock,
        updated_at: new Date().toISOString(),
      })
      .eq('id', medicineId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  adjustStockWithServiceRole: async (medicineId, delta) => {
    const supabase = withServiceClient();

    const { data: current, error: fetchError } = await supabase
      .from('medicines')
      .select('id, current_stock')
      .eq('id', medicineId)
      .single();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    const nextStock = Math.max(0, (current?.current_stock || 0) + delta);

    const { error } = await supabase
      .from('medicines')
      .update({
        current_stock: nextStock,
        updated_at: new Date().toISOString(),
      })
      .eq('id', medicineId);

    if (error) {
      throw new Error(error.message);
    }
  },

  remove: async (medicineId, userId, token) => {
    const supabase = withUserClient(token);

    const { error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', medicineId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = {
  medicineRepository,
};
