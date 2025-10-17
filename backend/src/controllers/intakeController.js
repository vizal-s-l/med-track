const { intakeService } = require('../services/intakeService');

const listIntakes = async (req, res) => {
  try {
    const intakes = await intakeService.listIntakes(req.user, req.userToken, req.query);
    res.json(intakes);
  } catch (error) {
    console.error('Error fetching intakes:', error);
    res.status(500).json({ error: 'Failed to fetch intakes' });
  }
};

const createIntake = async (req, res) => {
  try {
    const intake = await intakeService.createIntake(req.user, req.userToken, req.body);
    res.status(201).json(intake);
  } catch (error) {
    console.error('Error creating intake:', error);
    res.status(500).json({ error: 'Failed to create intake' });
  }
};

const updateIntake = async (req, res) => {
  try {
    const intake = await intakeService.updateIntake(
      req.user,
      req.userToken,
      req.params.id,
      req.body,
    );
    res.json(intake);
  } catch (error) {
    console.error('Error updating intake:', error);
    res.status(500).json({ error: 'Failed to update intake' });
  }
};

const generateDailyIntakes = async (req, res) => {
  try {
    const result = await intakeService.generateDailyIntakes(req.user, req.userToken, req.body);
    res.json(result);
  } catch (error) {
    console.error('Error generating daily intakes:', error);
    res.status(500).json({ error: 'Failed to generate daily intakes' });
  }
};

module.exports = {
  listIntakes,
  createIntake,
  updateIntake,
  generateDailyIntakes,
};
