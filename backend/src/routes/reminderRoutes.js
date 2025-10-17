const express = require('express');
const {
  getReminderSettings,
  upsertReminderSettings,
  registerPushToken,
  deletePushToken,
} = require('../controllers/reminderController');

const router = express.Router();

router.get('/settings', getReminderSettings);
router.post('/settings', upsertReminderSettings);
router.post('/push-token', registerPushToken);
router.delete('/push-token/:id', deletePushToken);

module.exports = router;
