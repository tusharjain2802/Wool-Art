const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

router.post('/save', billController.saveBill);
router.post('/view', billController.saveBill);

module.exports = router;
