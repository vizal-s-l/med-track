const express = require('express');
const {
  listMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} = require('../controllers/medicineController');

const router = express.Router();

router.get('/', listMedicines);
router.post('/', createMedicine);
router.put('/:id', updateMedicine);
router.delete('/:id', deleteMedicine);

module.exports = router;
