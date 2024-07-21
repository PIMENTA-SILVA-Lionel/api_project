import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import Login from './components/Login';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Market from './components/Market';
import Cart from './components/Cart';
import Auction from './components/Auction';
import Contact from './components/Contact'; // Import the Contact component
import Layout from './components/Layout';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<LayoutRoutes />} />
      </Routes>
    </Router>
  );
};

const LayoutRoutes = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');
  let username = '';

  if (token) {
    const decoded = jwtDecode(token);
    username = decoded.username; // Assuming the token contains a 'username' field
  }

  return (
    <Layout>
      <Routes>
        <Route path="/home" element={<Home username={username} token={token} />} />
        <Route path="/dashboard" element={<Dashboard token={token} />} />
        <Route path="/cart" element={<Cart token={token} />} />
        <Route path="/market" element={<Market token={token} />} />
        <Route path="/auction" element={<Auction token={token} />} />
        <Route path="/contact" element={<Contact />} /> {/* Add this line */}
      </Routes>
    </Layout>
  );
};

export default App;
