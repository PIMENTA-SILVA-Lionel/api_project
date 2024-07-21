import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css';

const Cart = ({ token }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!token) {
        console.log('User not authenticated');
        return;
      }

      try {
        const userId = getUserIdFromToken(token);
        const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
        setCartItems(response.data.cart);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [token]);

  const getUserIdFromToken = (token) => {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const handleRemoveFromCart = async (catId) => {
    if (!token) {
      console.log('User not authenticated');
      return;
    }

    try {
      const userId = getUserIdFromToken(token);
      const response = await axios.delete('http://localhost:5000/api/cart/remove', {
        data: { userId, catId },
      });
      setCartItems(response.data.cart);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-image" />
            <div className="cart-info">
              <h3 className="cart-name">{item.name}</h3>
              <p className="cart-description">{item.description}</p>
              <p className="cart-age">Age: {item.age} years</p>
              <p className="cart-price">${item.price}</p>
              <button
                className="cart-button"
                style={{ backgroundColor: 'red' }}
                onClick={() => handleRemoveFromCart(item._id)}
              >
                Delete from Cart
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;
