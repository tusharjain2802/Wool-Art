const express = require('express');
const router = express.Router();
const rateListController = require('../controllers/rateListController');

// Get all rate list names
router.get('/rate-lists', rateListController.getRateLists);

// Create a new rate list
router.post('/create-rate-list', rateListController.createRateList);

// Delete a rate list
router.post('/delete-list/:id', rateListController.deleteRateList);

router.get('/rate-list/:id', rateListController.getRateListDetails);
router.post('/rate-list/:id/add-item', rateListController.addItemToRateList);
router.put('/rate-list/:id/update-item', rateListController.updateItemInRateList);
router.delete('/rate-list/:id/delete-item', rateListController.deleteItemFromRateList);


module.exports = router;
