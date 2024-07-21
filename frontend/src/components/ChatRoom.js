import React, { useState, useEffect } from 'react';

function ChatRoom({ socket, username }) {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const isAuthenticated = !!username; // Check if the user is authenticated

  useEffect(() => {
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
      if (message.type === 'newMessage') {
        setMessages((prevMessages) => [...prevMessages, message.message]);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (newMessage.trim() && isAuthenticated) {
      const message = {
        user: username, // Use the user's username
        text: newMessage,
        timestamp: new Date().toISOString(),
      };
      socket.send(JSON.stringify({ type: 'chat', data: message }));
      setNewMessage('');
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        style={{
          height: 'calc(100% - 60px)',
          overflowY: 'auto',
          padding: '10px',
          border: '1px solid gray',
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ margin: '10px 0' }}>
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          padding: '10px',
          backgroundColor: 'white',
        }}
      >
        <input
          type='text'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && isAuthenticated) {
              handleSendMessage();
            }
          }}
          style={{ width: '80%' }}
          disabled={!isAuthenticated} // Disable input if the user is not authenticated
          placeholder={
            isAuthenticated ? 'Type a message' : 'Please log in to chat'
          }
        />
        <button
          onClick={handleSendMessage}
          style={{ width: '20%' }}
          disabled={!isAuthenticated}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
