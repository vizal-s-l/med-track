const express = require('express');
const {
  listHealthMetrics,
  createHealthMetric,
} = require('../controllers/healthMetricController');

const router = express.Router();

router.get('/', listHealthMetrics);
router.post('/', createHealthMetric);

module.exports = router;
