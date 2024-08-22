import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [flashMessage, setFlashMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const navigate = useNavigate();
  //const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    let noteTimeout;
    if (isLoading) {
      noteTimeout = setTimeout(() => {
        setShowNote(true);
      }, 5000);
    }
    return () => clearTimeout(noteTimeout);
  }, [isLoading]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Introduce a delay of 10 seconds for testing the spinbar feature
    //await delay(10000);

    if (password !== confirmPassword) {
      setFlashMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/register`, {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, name })
    });

    setIsLoading(false);
    if (response.ok) {
      navigate(`/login?flashMessage=Successfully registered an account for ${username}. Please log in.`);
    } else {
      const errorText = await response.text();
      setFlashMessage(`Registration failed: ${errorText}`);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatch(password === value);
  };

  const isFormValid = password === confirmPassword && username && password && confirmPassword;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Create a New Account</h1>
      {flashMessage && <div style={styles.flashMessage}>{flashMessage}</div>}
      {isLoading ? (
        <div style={styles.spinner}>
          <div style={styles.spinnerInner}></div>
          <p>Registration in progress...</p>
          {showNote && <p style={styles.note}>Please note, registration may take longer if the server is booting up. Thank you for your patience!</p>}
        </div>
      ) : (
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
          <div style={styles.confirmPasswordContainer}>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              style={styles.input}
            />
            {confirmPassword && (
              <span style={!password || !passwordMatch ? styles.errorMark : styles.checkMark}>
                {!password || !passwordMatch ? '✘' : '✔'}
              </span>
            )}
          </div>
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
      )}
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
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  confirmPasswordContainer: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  checkMark: {
    marginLeft: '10px',
    color: 'green',
    fontSize: '24px', // Increase the font size to match the height of the input field
    lineHeight: '40px', // Adjust line height to center the mark vertically
  },
  errorMark: {
    marginLeft: '10px',
    color: 'red',
    fontSize: '24px', // Increase the font size to match the height of the input field
    lineHeight: '40px', // Adjust line height to center the mark vertically
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
  },
  spinner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  spinnerInner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 2s linear infinite',
  },
  note: {
    marginTop: '10px',
    color: '#666',
    fontSize: '14px',
    textAlign: 'center',
  },
};

export default Register;