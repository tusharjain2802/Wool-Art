const RateList = require('../models/RateList');
const { v4: uuidv4 } = require('uuid');

// Get all rate list names
exports.getRateLists = async (req, res) => {
  try {
    const rateLists = await RateList.find().select('rateListName rateListId');
    res.json(rateLists);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new rate list
exports.createRateList = async (req, res) => {
  try {
    const { rateListName } = req.body;
    if (!rateListName) {
      return res.status(400).json({ error: 'Rate list name is required' });
    }

    const newRateList = new RateList({
      rateListName,
      items: [],
      rateListId: uuidv4()
    });

    await newRateList.save();
    res.status(201).json(newRateList);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a rate list
exports.deleteRateList = async (req, res) => {
  try {
    const { id } = req.params;
    const rateList = await RateList.findOneAndDelete({ rateListId: id });
    if (!rateList) {
      return res.status(404).json({ error: 'Rate list not found' });
    }
    res.status(200).json({ message: 'Rate list deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
