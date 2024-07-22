const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
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
