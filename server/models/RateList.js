const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  artNumber: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true
  }
});

const RateListSchema = new mongoose.Schema({
  rateListName: {
    type: String,
    required: true
  },
  items: [ItemSchema],
  rateListId: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('RateList', RateListSchema);
