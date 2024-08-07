// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [flashMessage, setFlashMessage] = useState(''); // New state for flash message
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setFlashMessage('Passwords do not match'); // Set flash message for password mismatch
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/register`, {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, name })
    });

    if (response.ok) {
      navigate(`/login?flashMessage=Successfully registered an account for ${username}. Please log in.`);
    } else {
      const errorText = await response.text();
      setFlashMessage(`Registration failed: ${errorText}`); // Set flash message for registration error
    }
  };

  const isFormValid = password === confirmPassword && username && password && confirmPassword;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Create a New Account</h1>
      {flashMessage && <div style={styles.flashMessage}>{flashMessage}</div>} {/* Display flash message */}
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Name (optional)"
          value={name}
          onChange={e => setName(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={isFormValid ? styles.button : {...styles.button, ...styles.buttonDisabled}} disabled={!isFormValid}>
          Register
        </button>
      </form>
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
    maxWidth: '500px',
    margin: 'auto',
    marginTop: '50px'
  },
  title: {
    fontSize: '32px',
    marginBottom: '10px',
    color: '#4B0082',
    textAlign: 'center'
  },
  flashMessage: {
    backgroundColor: '#f8d7da', // Red background for error messages
    color: '#721c24', // Dark red text for error messages
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
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed'
  }
};

export default Register;