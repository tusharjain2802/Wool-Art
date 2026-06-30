const RateList = require('../models/RateList');
const { v4: uuidv4 } = require('uuid');

// Get all rate list names
exports.getRateLists = async (req, res) => {
  try {
    const rateLists = await RateList.find({});
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

// Get rate list details by ID
exports.getRateListDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const rateList = await RateList.findOne({ rateListId: id });
    if (!rateList) {
      return res.status(404).json({ error: 'Rate list not found' });
    }
    res.json(rateList);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Add item to rate list
exports.addItemToRateList = async (req, res) => {
  try {
    const { id } = req.params;
    const { artNumber, rate } = req.body;
    const rateList = await RateList.findOne({ rateListId: id });
    if (!rateList) {
      return res.status(404).json({ error: 'Rate list not found' });
    }
    rateList.items.push({ artNumber, rate });
    await rateList.save();
    res.status(201).json(rateList);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update item in rate list
exports.updateItemInRateList = async (req, res) => {
  try {
    const { id } = req.params;
    const { index, artNumber, rate } = req.body;
    const rateList = await RateList.findOne({ rateListId: id });
    if (!rateList) {
      return res.status(404).json({ error: 'Rate list not found' });
    }
    if (index < 0 || index >= rateList.items.length) {
      return res.status(400).json({ error: 'Invalid item index' });
    }
    rateList.items[index] = { artNumber, rate };
    await rateList.save();
    res.status(200).json(rateList);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete item from rate list
exports.deleteItemFromRateList = async (req, res) => {
  try {
    const { id } = req.params;
    const { index } = req.body;
    const rateList = await RateList.findOne({ rateListId: id });
    if (!rateList) {
      return res.status(404).json({ error: 'Rate list not found' });
    }
    if (index < 0 || index >= rateList.items.length) {
      return res.status(400).json({ error: 'Invalid item index' });
    }
    rateList.items.splice(index, 1); // Remove the item from the array
    await rateList.save();
    res.status(200).json(rateList);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
