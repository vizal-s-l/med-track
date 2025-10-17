const { createSupabaseClient } = require('../utils/supabaseClient');

const withUserClient = (token) => createSupabaseClient(token);

const healthMetricRepository = {
  listByUser: async (userId, token) => {
    const supabase = withUserClient(token);

    const { data, error } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data.map((metric) => ({
      id: metric.id,
      user_id: metric.user_id,
      type: metric.type,
      recorded_at: metric.recorded_at,
      systolic: metric.systolic,
      diastolic: metric.diastolic,
      heartbeat: metric.heartbeat,
      sugar_context: metric.sugar_context,
      sugar_value: metric.sugar_value,
      notes: metric.notes,
      trend: metric.trend,
      status: metric.status,
      created_at: metric.created_at,
    }));
  },

  create: async (payload, token) => {
    const supabase = withUserClient(token);

    const { data, error } = await supabase
      .from('health_metrics')
      .insert([
        {
          user_id: payload.user_id,
          type: payload.type,
          recorded_at: payload.recorded_at,
          systolic: payload.systolic,
          diastolic: payload.diastolic,
          heartbeat: payload.heartbeat,
          sugar_context: payload.sugar_context,
          sugar_value: payload.sugar_value,
          notes: payload.notes,
          trend: payload.trend,
          status: payload.status,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: data.id,
      user_id: data.user_id,
      type: data.type,
      recorded_at: data.recorded_at,
      systolic: data.systolic,
      diastolic: data.diastolic,
      heartbeat: data.heartbeat,
      sugar_context: data.sugar_context,
      sugar_value: data.sugar_value,
      notes: data.notes,
      trend: data.trend,
      status: data.status,
      created_at: data.created_at,
    };
  },
};

module.exports = {
  healthMetricRepository,
};
