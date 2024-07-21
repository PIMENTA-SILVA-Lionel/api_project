import React, { useState, useEffect } from 'react';
import './Contact.css';

const Contact = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const socket = new WebSocket('ws://localhost:5000');
    setWs(socket);

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'init') {
        setMessages(data.messages);
      } else if (data.type === 'message') {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => socket.close();
  }, []);

  const handleSendMessage = () => {
    if (input.trim() && ws && username) {
      const message = {
        type: 'message',
        username: username,
        content: input,
      };
      ws.send(JSON.stringify(message));
      setInput('');
    }
  };

  return (
    <div className="contact">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.username}</strong> <span>{msg.timestamp}</span>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>
      <div className="input-section">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Contact;
