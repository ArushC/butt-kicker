// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

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
      throw new Error('Login failed');
    })
    .then(data => {
      sessionStorage.setItem('userId', data.userId);
      setIsAuthenticated(true);
      navigate(`/home/${data.userId}`);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Login failed');
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Butt Kicker</h1>
      <h2 style={styles.subtitle}>Description of my app</h2>
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
      <p style={styles.question}>Is this your first time here?</p>
      <button onClick={() => navigate('/register')} style={styles.registerButton}>Create A New Account</button>
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
  subtitle: {
    fontSize: '18px',
    marginBottom: '20px',
    color: '#4B0082',
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
  question: {
    marginTop: '20px',
    color: '#4B0082'
  },
  registerButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#F0E68C',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    color: '#4B0082'
  }
};

export default Login;