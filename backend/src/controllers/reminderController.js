const { reminderService } = require('../services/reminderService');

const getReminderSettings = async (req, res) => {
  try {
    const data = await reminderService.getSettings(req.user, req.userToken);
    res.json(data);
  } catch (error) {
    console.error('Error fetching reminder settings:', error);
    res.status(500).json({ error: 'Failed to fetch reminder settings' });
  }
};

const upsertReminderSettings = async (req, res) => {
  try {
    const data = await reminderService.upsertSettings(req.user, req.userToken, req.body);
    res.json(data);
  } catch (error) {
    console.error('Error updating reminder settings:', error);
    res.status(500).json({ error: 'Failed to update reminder settings' });
  }
};

const registerPushToken = async (req, res) => {
  try {
    const data = await reminderService.registerPushToken(req.user, req.body);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error registering push token:', error);
    res.status(500).json({ error: 'Failed to register push token' });
  }
};

const deletePushToken = async (req, res) => {
  try {
    await reminderService.deletePushToken(req.user, req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting push token:', error);
    res.status(500).json({ error: 'Failed to delete push token' });
  }
};

module.exports = {
  getReminderSettings,
  upsertReminderSettings,
  registerPushToken,
  deletePushToken,
};
