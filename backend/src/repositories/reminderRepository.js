const { createSupabaseClient } = require('../utils/supabaseClient');
const { intakeRepository } = require('./intakeRepository');
const { medicineRepository } = require('./medicineRepository');

const DEFAULT_TIMES = {
  morning_time: '08:00:00',
  afternoon_time: '14:00:00',
  night_time: '20:00:00',
  timezone: 'Asia/Kolkata',
};

const reminderRepository = {
  getSettings: async (userId, token) => {
    const supabase = createSupabaseClient(token);

    const { data, error } = await supabase
      .from('user_timing_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message);
    }

    return data || null;
  },

  upsertSettings: async (userId, token, payload) => {
    const supabase = createSupabaseClient(token);

    const dataToInsert = {
      user_id: userId,
      ...DEFAULT_TIMES,
      ...payload,
    };

    const { data, error } = await supabase
      .from('user_timing_settings')
      .upsert(dataToInsert, {
        onConflict: 'user_id',
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  registerPushToken: async (userId, payload) => {
    const supabase = createSupabaseClient(undefined, { useServiceRole: true });

    const { data, error } = await supabase
      .from('push_subscriptions')
      .upsert(
        {
          user_id: userId,
          token: payload.token,
          device_info: payload.device_info,
        },
        { onConflict: 'token' },
      )
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  deletePushToken: async (userId, pushTokenId) => {
    const supabase = createSupabaseClient(undefined, { useServiceRole: true });

    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('id', pushTokenId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }
  },

  listPushTokens: async (userId) => {
    const supabase = createSupabaseClient(undefined, { useServiceRole: true });

    const { data, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  generateDailyIntakes: async (user, token, payload, defaultTimes) => {
    const supabase = createSupabaseClient(token);

    const targetDate = payload.date ? new Date(payload.date) : new Date();

    const { data: timingSettings, error: timingError } = await supabase
      .from('user_timing_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (timingError && timingError.code !== 'PGRST116') {
      throw new Error(timingError.message);
    }

    const times = timingSettings || defaultTimes;

    const userSupabase = createSupabaseClient(token);

    const { data: medicines, error: medError } = await userSupabase
      .from('medicines')
      .select('*')
      .eq('user_id', user.id);

    if (medError) {
      throw new Error(medError.message);
    }

    const isoDate = targetDate.toISOString().split('T')[0];
    const intakesToCreate = [];

    for (const medicine of medicines) {
      if (medicine.morning_qty > 0) {
        intakesToCreate.push({
          user_id: user.id,
          medicine_id: medicine.id,
          scheduled_time: `${isoDate}T${times.morning_time}`,
          status: 'scheduled',
          quantity: medicine.morning_qty,
        });
      }

      if (medicine.afternoon_qty > 0) {
        intakesToCreate.push({
          user_id: user.id,
          medicine_id: medicine.id,
          scheduled_time: `${isoDate}T${times.afternoon_time}`,
          status: 'scheduled',
          quantity: medicine.afternoon_qty,
        });
      }

      if (medicine.night_qty > 0) {
        intakesToCreate.push({
          user_id: user.id,
          medicine_id: medicine.id,
          scheduled_time: `${isoDate}T${times.night_time}`,
          status: 'scheduled',
          quantity: medicine.night_qty,
        });
      }
    }

    if (intakesToCreate.length === 0) {
      return { message: 'No intakes to generate' };
    }

    const created = await intakeRepository.bulkInsert(intakesToCreate, token);

    return { message: `Generated ${created.length} intakes for ${targetDate.toDateString()}` };
  },

  findDueIntakes: async (from, to) => {
    const supabase = createSupabaseClient(undefined, { useServiceRole: true });

    const { data, error } = await supabase
      .from('intakes')
      .select('*')
      .eq('status', 'scheduled')
      .gte('scheduled_time', from.toISOString())
      .lte('scheduled_time', to.toISOString());

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  markIntakesNotified: async (intakeIds) => {
    const supabase = createSupabaseClient(undefined, { useServiceRole: true });

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
  reminderRepository,
};
