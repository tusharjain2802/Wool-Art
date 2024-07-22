const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const billSchema = new mongoose.Schema({
  billId: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  rateListName: {
    type: String,
    required: true,
  },
  items: [
    {
      artNumber: String,
      rate: Number,
      quantity: Number,
      total: Number,
    },
  ],
  discount: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Bill', billSchema);
