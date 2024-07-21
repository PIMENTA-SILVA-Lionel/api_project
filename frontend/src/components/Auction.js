import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Auction.css';

// Import images
import cat5 from '../assets/cat5.jpg';

const Auction = () => {
  const [cats, setCats] = useState([]);
  const [ws, setWs] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/auction');
        const data = response.data.map((cat) => {
          // Assign the specific image for the auction cat named "Tiger"
          if (cat.name === 'Tiger') {
            cat.image = cat5;
          }
          return cat;
        });
        setCats(data);
      } catch (error) {
        console.error('Error fetching cats:', error);
      }
    };

    fetchCats();

    const socket = new WebSocket('ws://localhost:5000');
    setWs(socket);

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'newBid') {
        setCats(prevCats => prevCats.map(cat => 
          cat._id === data.catId ? { ...cat, price: data.highestBid, bestBidder: data.bestBidder } : cat
        ));
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => socket.close();
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleBid = (cat, bid) => {
    if (!username) {
      console.log('User not authenticated');
      return;
    }

    if (bid > cat.price && ws) {
      ws.send(JSON.stringify({
        type: 'newBid',
        catId: cat._id,
        highestBid: parseFloat(bid),
        bestBidder: username
      }));
    } else {
      alert('Bid must be higher than the current highest bid.');
    }
  };

  return (
    <div className="auction">
      <h2>Live Auction</h2>
      <div className="cat-list">
        {cats.map((cat) => (
          <div key={cat._id} className="cat-card">
            {cat.bestBidder && <div className="best-bidder">Best Bidder: {cat.bestBidder}</div>}
            <img src={cat.image} alt={cat.name} className="cat-image" />
            <div className="cat-info">
              <h3 className="cat-name">{cat.name}</h3>
              <p className="cat-description">{cat.description}</p>
              <p className="cat-age">Age: {cat.age} years</p>
              <p className="cat-price">Current Price: ${cat.price}</p>
              <input 
                type="number" 
                className="bid-input" 
                placeholder="Enter your bid" 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleBid(cat, e.target.value);
                }}
              />
              <button 
                className="bid-button" 
                onClick={() => handleBid(cat, document.querySelector('.bid-input').value)}
              >
                Place Bid
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Auction;
