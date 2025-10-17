const { healthMetricRepository } = require('../repositories/healthMetricRepository');

const validateMetricPayload = (payload) => {
  const { type, recorded_at, systolic, diastolic } = payload;

  if (!type) {
    throw new Error('Metric type is required');
  }

  const allowedTypes = ['blood_pressure', 'blood_sugar', 'combined'];

  if (!allowedTypes.includes(type)) {
    throw new Error('Invalid metric type');
  }

  if (!recorded_at) {
    throw new Error('Recorded time is required');
  }

  const pressureProvided =
    payload.systolic !== undefined ||
    payload.diastolic !== undefined ||
    payload.heartbeat !== undefined;

  const sugarProvided =
    payload.sugar_context !== undefined || payload.sugar_value !== undefined;

  if (!pressureProvided && !sugarProvided) {
    throw new Error('Provide at least blood pressure or blood sugar data');
  }

  if (pressureProvided) {
    if (
      payload.systolic === undefined ||
      payload.diastolic === undefined ||
      payload.heartbeat === undefined
    ) {
      throw new Error('Blood pressure requires systolic, diastolic, and heartbeat');
    }

    if (systolic <= 0 || diastolic <= 0) {
      throw new Error('Blood pressure values must be positive');
    }
  }

  if (sugarProvided) {
    if (!payload.sugar_context || payload.sugar_value === undefined) {
      throw new Error('Blood sugar requires context and value');
    }

    const contexts = ['fasting', 'after_food', 'random'];

    if (!contexts.includes(payload.sugar_context)) {
      throw new Error('Invalid blood sugar context');
    }
  }
};

const healthMetricService = {
  listMetrics: async (user, token) => {
    return healthMetricRepository.listByUser(user.id, token);
  },

  createMetric: async (user, token, payload) => {
    validateMetricPayload(payload);

    const data = await healthMetricRepository.create(
      {
        ...payload,
        user_id: user.id,
      },
      token,
    );

    return data;
  },
};

module.exports = {
  healthMetricService,
};
