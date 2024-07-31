import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5001');

const Forum = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetch(`/api/forum/${id}`)
      .then(response => response.json())
      .then(data => setMessages(data))
      .catch(err => console.error('Error fetching messages:', err));

    socket.on('new_message', (newMessage) => {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('new_message');
    };
  }, [id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      fetch(`/api/forum/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: id, anonymous, message })
      })
        .then(response => response.json())
        .then(() => {
          setMessage(''); // Clear the input field without updating the messages state
          socket.emit('message_sent'); // Notify the server that a message was sent
        })
        .catch(err => console.error('Error posting message:', err));
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    setIsTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#d3f0ff' }}>
      <div style={{ backgroundColor: '#ffffe0', padding: '20px', borderRadius: '10px', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ padding: '10px', margin: '10px 0', backgroundColor: 'white', borderRadius: '10px' }}>
              <p><strong>{msg.anonymous ? 'Anonymous' : msg.username}</strong></p>
              <p>{msg.message}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {isTyping && <div style={{ textAlign: 'right', fontSize: '12px' }}>...</div>}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
          <input
            type="checkbox"
            checked={anonymous}
            onChange={() => setAnonymous(!anonymous)}
            style={{ marginRight: '10px' }}
          />
          <span>Post Anonymously</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          <input
            type="text"
            value={message}
            onChange={handleTyping}
            placeholder="Share something..."
            style={{ flex: '1', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button
            onClick={handleSendMessage}
            style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#4B0082', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Send
          </button>
        </div>
      </div>
      <button
        style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#4B0082', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        Back
      </button>
    </div>
  );
};

export default Forum;
