import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Define username state here
  const navigate = useNavigate();

  const handleGoogleLogin = useCallback(async (credentialResponse) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/google-login', {
        id_token: credentialResponse.credential,
      });

      const token = response.data.token;
      const googleUsername = response.data.username; // Rename the variable to avoid confusion
      localStorage.setItem('token', token);
      localStorage.setItem('username', googleUsername);
      navigate(`/home?token=${token}`);
    } catch (error) {
      console.error('Google login failed:', error);
    }
  }, [navigate]);

  useEffect(() => {
    window.onload = function () {
      window.google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        callback: handleGoogleLogin,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignIn'),
        { theme: 'outline', size: 'large' } // customization attributes
      );
      window.google.accounts.id.prompt(); // also display the One Tap dialog
    };
  }, [handleGoogleLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      const token = response.data.token;
      const loginUsername = response.data.username; // Rename the variable to avoid confusion
      localStorage.setItem('token', token);
      localStorage.setItem('username', loginUsername);
      navigate(`/home?token=${token}`);
    } catch (error) {
      console.error('Login failed:', error);
      window.alert('Please register first');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', { username, email, password });
      const token = response.data.token;
      const registerUsername = response.data.username; // Rename the variable to avoid confusion
      localStorage.setItem('token', token);
      localStorage.setItem('username', registerUsername);
      navigate(`/home?token=${token}`);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <div className="login-avatar"></div>
        </div>
        <div className="login-right">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email ID</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
            <button type="submit" className="login-button">LOGIN</button>
            <button type="button" className="register-button" onClick={handleRegister}>REGISTER NOW</button>
            <button type="button" className="forgot-button">FORGOT PASSWORD</button>
          </form>
          <div id="googleSignIn" className="google-button"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
