// src/components/Home.js
import React from 'react';
import './Home.css';
import MarketplaceButton from './MarketplaceButton';

const Home = ({ username, token }) => {
  return (
    <div className="home">
      <h2>Welcome <span className="username">{username}</span> to Cat Shop!</h2>
      <p>Cat Shop is your one-stop destination for all things cats. Whether you're looking to adopt a new furry friend, find the best cat supplies, or just learn more about our feline companions, we've got you covered. Explore our site to discover more!</p>
      <MarketplaceButton token={token} /> {/* Add the MarketplaceButton */}
    </div>
  );
};

export default Home;
