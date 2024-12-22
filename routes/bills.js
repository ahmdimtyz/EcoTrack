const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Path to the JSON file
const dataFilePath = path.join(__dirname, '../data/bills-data.json');

// Helper function to read JSON file
function readBillsData() {
  const data = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(data);
}

// Endpoint for monthly bills
router.get('/month', (req, res) => {
  const data = readBillsData();
  res.json(data.monthlyBills);
});

// Endpoint for daily bills
router.get('/day', (req, res) => {
  const data = readBillsData();
  res.json(data.dailyBills);
});

module.exports = router;
