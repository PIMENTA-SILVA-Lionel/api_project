const express = require('express');
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');
const router = express.Router();

router.post('/add', addToCart);
router.get('/:userId', getCart);
router.delete('/remove', removeFromCart); // Add DELETE route for removing cart items

module.exports = router;
