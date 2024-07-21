import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CatCardAuction.css';

const CatCardAuction = ({ cat, token }) => {
  const [bid, setBid] = useState('');
  const [highestBid, setHighestBid] = useState(cat.price);
  const [bestBidder, setBestBidder] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const fetchHighestBid = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auction/highestBid/${cat._id}`);
        setHighestBid(response.data.highestBid);
        setBestBidder(response.data.bestBidder);
      } catch (error) {
        console.error('Error fetching highest bid:', error);
      }
    };

    fetchHighestBid();

    const socket = new WebSocket('ws://localhost:5000');
    setWs(socket);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'newBid' && data.catId === cat._id) {
        setHighestBid(data.highestBid);
        setBestBidder(data.bestBidder);
      }
    };

    return () => socket.close();
  }, [cat._id]);

  const handleAddToCart = async () => {
    if (!token) {
      console.log('User not authenticated');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/cart/add', {
        userId: getUserIdFromToken(token),
        cat
      });
      console.log(response.data.message);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const getUserIdFromToken = (token) => {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const handleBid = async () => {
    if (!token) {
      console.log('User not authenticated');
      return;
    }

    const username = localStorage.getItem('username');

    try {
      const response = await axios.post('http://localhost:5000/api/auction/placeBid', {
        catId: cat._id,
        bid: parseFloat(bid),
        bidder: username
      });

      if (response.status === 200) {
        ws.send(JSON.stringify({
          type: 'newBid',
          catId: cat._id,
          highestBid: parseFloat(bid),
          bestBidder: username
        }));
        setBid('');
      }
    } catch (error) {
      console.error('Error placing bid:', error);
    }
  };

  return (
    <div className="cat-card">
      {bestBidder && <div className="best-bidder">Best Bidder: {bestBidder}</div>}
      <img src={cat.image} alt={cat.name} className="cat-image" />
      <div className="cat-info">
        <h3 className="cat-name">{cat.name}</h3>
        <p className="cat-description">{cat.description}</p>
        <p className="cat-age">Age: {cat.age} years</p>
        <p className="cat-price">Current Price: ${highestBid}</p>
        <input 
          type="number" 
          value={bid} 
          onChange={(e) => setBid(e.target.value)} 
          className="bid-input" 
          placeholder="Enter your bid" 
        />
        <button className="bid-button" onClick={handleBid}>Place Bid</button>
        <button className="cat-button" onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
};

export default CatCardAuction;
