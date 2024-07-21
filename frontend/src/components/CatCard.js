import React from 'react';
import axios from 'axios';
import './CatCard.css';

const CatCard = ({ cat, token }) => {
  const handleAddToCart = async () => {
    if (!token) {
      console.log('User not authenticated');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/cart/add', {
        userId: getUserIdFromToken(token), // Extract user ID from token
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

  return (
    <div className="cat-card">
      <img src={cat.image} alt={cat.name} className="cat-image" />
      <div className="cat-info">
        <h3 className="cat-name">{cat.name}</h3>
        <p className="cat-description">{cat.description}</p>
        <p className="cat-age">Age: {cat.age} years</p>
        <p className="cat-price">${cat.price}</p>
        <button className="cat-button" onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
};

export default CatCard;
