const { medicineService } = require('../services/medicineService');

const listMedicines = async (req, res) => {
  try {
    const medicines = await medicineService.listMedicines(req.user, req.userToken);
    res.json(medicines);
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json({ error: 'Failed to fetch medicines' });
  }
};

const createMedicine = async (req, res) => {
  try {
    const medicine = await medicineService.createMedicine(
      req.user,
      req.userToken,
      req.body,
    );
    res.status(201).json(medicine);
  } catch (error) {
    console.error('Error creating medicine:', error);
    res.status(500).json({ error: 'Failed to create medicine' });
  }
};

const updateMedicine = async (req, res) => {
  try {
    const medicine = await medicineService.updateMedicine(
      req.user,
      req.userToken,
      req.params.id,
      req.body,
    );
    res.json(medicine);
  } catch (error) {
    console.error('Error updating medicine:', error);
    res.status(500).json({ error: 'Failed to update medicine' });
  }
};

const deleteMedicine = async (req, res) => {
  try {
    await medicineService.deleteMedicine(req.user, req.userToken, req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting medicine:', error);
    res.status(500).json({ error: 'Failed to delete medicine' });
  }
};

module.exports = {
  listMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
};
