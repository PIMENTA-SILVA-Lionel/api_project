const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  cart: [
    {
      name: String,
      description: String,
      age: Number,
      price: Number,
      image: String
    }
  ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
