const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const billSchema = new mongoose.Schema({
  customerName: { 
    type: String, 
    required: true 
  },
  billId: {
    type: String,
    default: uuidv4,
    unique: true,
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
  isPaid: { 
    type: Boolean, 
    required: true 
  },
  advance: { 
    type: Number, 
    default: 0 
  },
  pendingBalance: { 
    type: Number, 
    default: 0 
  },
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);
