// src/components/Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>Follow us on social media:</p>
        <div className="social-icons">
          <img src="https://img.icons8.com/color/48/000000/facebook.png" alt="Facebook" />
          <img src="https://img.icons8.com/color/48/000000/twitter.png" alt="Twitter" />
          <img src="https://img.icons8.com/color/48/000000/instagram-new.png" alt="Instagram" />
          <img src="https://img.icons8.com/color/48/000000/linkedin.png" alt="LinkedIn" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
