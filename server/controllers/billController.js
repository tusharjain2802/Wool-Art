const Bill = require('../models/Bill');

exports.saveBill = async (req, res) => {
  const { rateListName, items, discount, total } = req.body;
  try {
    const newBill = new Bill({
      rateListName,
      items,
      discount,
      total,
    });
    await newBill.save();
    res.status(201).json({ message: 'Bill saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().sort({ date: -1 });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
