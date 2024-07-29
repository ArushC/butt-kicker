// src/components/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [flashMessage, setFlashMessage] = useState(''); //State for success message
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const message = query.get('flashMessage');
    if (message) {
      setFlashMessage(message);
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Login failed: invalid username or password');
    })
    .then(data => {
      sessionStorage.setItem('userId', data.userId);
      setIsAuthenticated(true);
      navigate(`/home/${data.userId}`);
    })
    .catch(error => {
      console.error('Error:', error);
      setErrorMessage('Login failed: invalid username or password'); // Set error message
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Butt Kicker</h1>
      <h2 style={styles.description}>Description of my app</h2>
      {flashMessage && <div style={styles.flashMessage}>{flashMessage}</div>}
      {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>} {/* Display error message */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          required
          style={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
      <p>Is this your first time here?</p>
      <button onClick={() => navigate('/register')} style={styles.registerButton}>
        Create A New Account
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#d3f0ff',
    borderRadius: '10px',
    maxWidth: '400px',
    margin: 'auto',
    marginTop: '50px'
  },
  title: {
    fontSize: '32px',
    marginBottom: '10px',
    color: '#4B0082',
    textAlign: 'center'
  },
  description: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#4B0082',
    textAlign: 'center'
  },
  flashMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center'
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4B0082',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px'
  },
  registerButton: {
    padding: '10px 20px',
    backgroundColor: '#ffa500',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px'
  }
};

export default Login;