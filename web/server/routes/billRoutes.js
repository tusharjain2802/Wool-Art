const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

router.post('/save', billController.saveBill);
router.get('/view', billController.getAllBills);
router.delete('/delete/:billId', billController.deleteBill);
router.get('/details/:billId', billController.getBillDetails);
router.put('/edit/:billId', billController.editBill);
module.exports = router;
