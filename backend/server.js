const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const auctionRoutes = require('./routes/auctionRoutes');
const productRoutes = require('./routes/productRoutes');
const Product = require('./models/productModel');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes); // Use auth routes
app.use('/api/auction', auctionRoutes);
app.use('/api/products', productRoutes);

mongoose.connect('mongodb://localhost:27017/projet_lionel_fabien_romain')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let highestBids = {}; // Store highest bids for each cat
let messages = []; // Store messages

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.send(JSON.stringify({ type: 'init', messages }));

  ws.on('message', async (message) => {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === 'newBid') {
      const { catId, highestBid, bestBidder } = parsedMessage;
      highestBids[catId] = { highestBid, bestBidder };

      // Update the product in the database
      try {
        await Product.findByIdAndUpdate(catId, { price: highestBid, bestBidder: bestBidder });

        // Broadcast the new bid to all clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'newBid', catId, highestBid, bestBidder }));
          }
        });
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }

    // Handle instant messages
    if (parsedMessage.type === 'message') {
      const { username, content } = parsedMessage;
      const timestamp = new Date().toLocaleTimeString();
      const newMessage = { username, content, timestamp };
      messages.push(newMessage);

      // Broadcast the new message to all clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'message', ...newMessage }));
        }
      });
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.log('WebSocket error:', error);
  });
});

server.listen(5000, () => console.log(`Server running on port 5000`));
