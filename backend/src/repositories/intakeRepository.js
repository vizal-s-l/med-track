const { createSupabaseClient } = require('../utils/supabaseClient');

const withUserClient = (token) => createSupabaseClient(token);

const intakeRepository = {
  listByUser: async (userId, token, { date } = {}) => {
    const supabase = withUserClient(token);

    let query = supabase
      .from('intakes')
      .select(`
        *,
        medicines (
          id,
          name,
          morning_qty,
          afternoon_qty,
          night_qty
        )
      `)
      .eq('user_id', userId)
      .order('scheduled_time', { ascending: true });

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query = query
        .gte('scheduled_time', startOfDay.toISOString())
        .lte('scheduled_time', endOfDay.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  create: async (payload, token) => {
    const supabase = withUserClient(token);

    const { data, error } = await supabase
      .from('intakes')
      .insert([{ ...payload, stock_adjusted: payload.stock_adjusted ?? false }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  update: async (intakeId, userId, payload, token) => {
    const supabase = withUserClient(token);

    const { data, error } = await supabase
      .from('intakes')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', intakeId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  findById: async (intakeId, userId, token) => {
    const supabase = withUserClient(token);

    const { data, error } = await supabase
      .from('intakes')
      .select('*')
      .eq('id', intakeId)
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  markAdjusted: async (intakeId, userId, token, stockAdjusted) => {
    const supabase = withUserClient(token);

    const { data, error } = await supabase
      .from('intakes')
      .update({ stock_adjusted: stockAdjusted, updated_at: new Date().toISOString() })
      .eq('id', intakeId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  bulkInsert: async (intakes, token) => {
    const supabase = withUserClient(token);

    const { data, error } = await supabase.from('intakes').insert(intakes).select();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  findDueIntakes: async (token, { from, to, status = 'scheduled' }) => {
    const supabase = withUserClient(token);

    let query = supabase
      .from('intakes')
      .select('*')
      .eq('status', status)
      .gte('scheduled_time', from)
      .lte('scheduled_time', to);

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  markAsNotified: async (intakeIds, token) => {
    const supabase = withUserClient(token);

    const { error } = await supabase
      .from('intakes')
      .update({ status: 'notified' })
      .in('id', intakeIds);

    if (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = {
  intakeRepository,
};
