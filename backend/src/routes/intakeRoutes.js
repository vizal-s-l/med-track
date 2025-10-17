const express = require('express');
const {
  listIntakes,
  createIntake,
  updateIntake,
  generateDailyIntakes,
} = require('../controllers/intakeController');

const router = express.Router();

router.get('/', listIntakes);
router.post('/', createIntake);
router.put('/:id', updateIntake);
router.post('/generate-daily', generateDailyIntakes);

module.exports = router;
