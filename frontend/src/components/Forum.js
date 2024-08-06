import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { API_BASE_URL } from '../config';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5001');

const Forum = () => {
  const location = useLocation();
  const notFromHome = location.state?.notFromHome;
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [interimTranscript, setInterimTranscript] = useState('');

  const [username, setUsername] = useState('Unknown User');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/users/${id}`, {
      credentials: 'include'
    })
      .then(response => {
        if (response.status === 401) {
          navigate('/login');
          return; // Exit the promise chain
        }
        return response.json();
      })
      .then(data => setUsername(data.username))
      .catch(() => navigate('/login'));
  }, [id, navigate]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/forum/${id}`, {
      credentials: 'include'
    })
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
      const messageData = {
        user_id: id,
        anonymous,
        username: anonymous ? 'Anonymous' : username,
        message
      };

      fetch(`${API_BASE_URL}/api/forum/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData),
        credentials: 'include'
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

  const handleVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setInterimTranscript(interimTranscript);
      setMessage(prevMessage => `${prevMessage.trim()} ${finalTranscript.trim()}`); // Add a single space between the previous contents and new contents
    };

    recognition.start();
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#d3f0ff', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '20px', fontSize: '2em' }}>The Forum</h1>
      <div style={{ backgroundColor: '#ffffe0', padding: '20px', borderRadius: '10px', width: '100%', maxWidth: '600px', margin: '0 auto', boxSizing: 'border-box' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', position: 'relative', width: '100%' }}>
          <textarea
            value={message}
            onChange={handleTyping}
            placeholder="Share something..."
            style={{ flex: '1', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', height: '100px', resize: 'none' }}
            rows="4"
          />
          <button
            onClick={handleSendMessage}
            style={{ marginLeft: '10px', padding: '0 20px', backgroundColor: '#4B0082', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', height: '100px' }}
          >
            Send
          </button>
          <button
            onClick={handleVoiceInput}
            style={{
              position: 'absolute',
              right: '90px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              height: '50px'
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isListening ? 'red' : 'black'}
              width="24px"
              height="24px"
            >
              <path d="M12 2C10.35 2 9 3.35 9 5V11C9 12.65 10.35 14 12 14C13.65 14 15 12.65 15 11V5C15 3.35 13.65 2 12 2ZM5 11H7C7 13.76 9.24 16 12 16C14.76 16 17 13.76 17 11H19C19 14.26 16.87 17.1 13.75 17.82V21H10.25V17.82C7.13 17.1 5 14.26 5 11Z"/>
            </svg>
          </button>
        </div>
        {interimTranscript && (
          <div style={{ marginTop: '10px', fontSize: '14px', color: 'gray' }}>
            {interimTranscript}
          </div>
        )}
      </div>
      <button
        style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#4B0082', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        onClick={() => notFromHome ? navigate(`/smoked/${id}`) : navigate('/')}
      >
        Back
      </button>
    </div>
  );
};

export default Forum;