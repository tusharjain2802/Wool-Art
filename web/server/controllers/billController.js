const Bill = require('../models/Bill');

exports.saveBill = async (req, res) => {
  const { customerName, rateListName, items, discount, total, isPaid, advance, pendingBalance} = req.body;
  try {
    const newBill = new Bill({
      customerName,
      rateListName,
      items,
      discount,
      total,
      isPaid,
      advance,
      pendingBalance,
    });
    await newBill.save();
    res.status(201).json({ message: 'Bill saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


exports.editBill = async (req, res) => {
  const { billId } = req.params;
  console.log(billId);
  const { customerName, rateListName, items, discount, total, isPaid, advance, pendingBalance} = req.body;
  try {
    const bill = await Bill.findOne({ billId });

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    bill.customerName = customerName;
    bill.rateListName = rateListName;
    bill.items = items;
    bill.discount = discount;
    bill.total = total;
    bill.isPaid = isPaid;
    bill.advance = advance;
    bill.pendingBalance = pendingBalance;

    await bill.save();

    res.status(200).json({ message: 'Bill updated successfully', bill });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getAllBills = async (req, res) => {
  try {  
    const bills = await Bill.find().sort({ createdAt: -1 }); 
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}; 

exports.deleteBill = async (req, res) => {
  const { billId } = req.params;
  try {
    await Bill.findOneAndDelete({ billId });
    res.status(200).json({ message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getBillDetails = async (req, res) => {
  const { billId } = req.params;
  try {
    const bill = await Bill.findOne({ billId:billId });
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    res.status(200).json(bill);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
