// backend/controllers/auctionController.js
let highestBids = {};

const getHighestBid = (req, res) => {
  const { catId } = req.params;
  
  const highestBid = highestBids[catId] || { highestBid: 0, bestBidder: null };
  res.status(200).json(highestBid);
};

const placeBid = (req, res) => {
  const { catId, bid, bidder } = req.body;

  if (!highestBids[catId] || bid > highestBids[catId].highestBid) {
    highestBids[catId] = { highestBid: bid, bestBidder: bidder };
    res.status(200).json({ message: 'Bid placed successfully', highestBid: highestBids[catId] });
  } else {
    res.status(400).json({ message: 'Bid must be higher than the current highest bid' });
  }
};

module.exports = { getHighestBid, placeBid };
