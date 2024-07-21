const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  highestBid: {
    amount: {
      type: Number,
      default: 0
    },
    bidder: {
      type: String,
      default: null
    }
  }
}, { timestamps: true });

const Auction = mongoose.model('Auction', auctionSchema);

module.exports = Auction;
