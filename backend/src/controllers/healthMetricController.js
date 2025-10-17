const { healthMetricService } = require('../services/healthMetricService');

const listHealthMetrics = async (req, res) => {
  try {
    const metrics = await healthMetricService.listMetrics(req.user, req.userToken);
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    res.status(500).json({ error: 'Failed to fetch health metrics' });
  }
};

const createHealthMetric = async (req, res) => {
  try {
    const metric = await healthMetricService.createMetric(req.user, req.userToken, req.body);
    res.status(201).json(metric);
  } catch (error) {
    console.error('Error creating health metric:', error);
    res.status(500).json({ error: 'Failed to create health metric' });
  }
};

module.exports = {
  listHealthMetrics,
  createHealthMetric,
};
