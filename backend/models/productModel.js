const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['market', 'auction'],
    required: true,
  },
  bestBidder: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model('Product', productSchema);
