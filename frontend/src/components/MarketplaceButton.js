import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MarketplaceButton.css';
import marketplaceImage from '../assets/marketplace.png'; // Ensure this path is correct

const MarketplaceButton = ({ token }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (token) {
      navigate(`/market?token=${token}`);
    } else {
      console.log('User not authenticated');
    }
  };

  return (
    <div className="marketplace-button" onClick={handleClick}>
      <img src={marketplaceImage} alt="Access to the marketplace" className="marketplace-image" />
    </div>
  );
};

export default MarketplaceButton;
