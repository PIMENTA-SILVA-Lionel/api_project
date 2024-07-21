import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CatCard from './CatCard';
import './Market.css';

// Import images
import cat1 from '../assets/cat1.jpg';
import cat2 from '../assets/cat2.jpg';
import cat3 from '../assets/cat3.jpg';
import cat4 from '../assets/cat4.jpg';

const Market = ({ token }) => {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/market');
        const data = response.data.map((cat, index) => {
          // Assign images based on the index or any other logic
          if (index === 0) cat.image = cat1;
          if (index === 1) cat.image = cat2;
          if (index === 2) cat.image = cat3;
          if (index === 3) cat.image = cat4;
          return cat;
        });
        setCats(data);
      } catch (error) {
        console.error('Error fetching cats:', error);
      }
    };

    fetchCats();
  }, []);

  return (
    <div className="market">
      {cats.map((cat) => (
        <CatCard key={cat._id} cat={cat} token={token} />
      ))}
    </div>
  );
};

export default Market;
