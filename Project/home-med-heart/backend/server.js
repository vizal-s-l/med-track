const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data (replace with database later)
let medicines = [
  {
    id: "1",
    name: "Aspirin",
    dosage: "500mg",
    frequency: "Twice daily",
    currentStock: 8,
    threshold: 10,
    totalQuantity: 30,
    nextDue: "Today, 2:00 PM"
  }
];

let healthMetrics = [
  {
    id: "1",
    type: "blood_pressure",
    value: "120/80",
    unit: "mmHg",
    date: "Today",
    time: "9:30 AM",
    trend: "stable",
    status: "normal"
  }
];

// Routes
app.get('/api/medicines', (req, res) => {
  res.json(medicines);
});

app.post('/api/medicines', (req, res) => {
  const newMedicine = { id: Date.now().toString(), ...req.body };
  medicines.push(newMedicine);
  res.status(201).json(newMedicine);
});

app.get('/api/health-metrics', (req, res) => {
  res.json(healthMetrics);
});

app.post('/api/health-metrics', (req, res) => {
  const newMetric = { id: Date.now().toString(), ...req.body };
  healthMetrics.push(newMetric);
  res.status(201).json(newMetric);
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});