// src/components/Header.js
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import kitten from '../assets/kitten.png';

const Header = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    // Redirect to login page
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <img src={kitten} alt="Kitten Logo" className="kitten-logo" /> {/* Add the image */}
          <h1>Cat Shop</h1>
        </div>
        <nav className="nav">
          <ul>
            <li><Link to={`/home?token=${token}`}>Home</Link></li>
            <li><Link to={`/market?token=${token}`}>Market</Link></li>
            <li><Link to={`/cart?token=${token}`}>Cart</Link></li>
            {/* <li><Link to={`/about?token=${token}`}>About Us</Link></li> */}
            <li><Link to={`/contact?token=${token}`}>Contact</Link></li>
            <li><Link to={`/auction?token=${token}`} className="auction-link">Auction</Link></li> {/* Include token in Auction link */}
            <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
