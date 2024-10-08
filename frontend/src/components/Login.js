import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State for spinner
  const navigate = useNavigate();
  const location = useLocation();
  const [flashMessage, setFlashMessage] = useState(''); // State for success message
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const [showNote, setShowNote] = useState(false); // State to control the display of the note
  //const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const message = query.get('flashMessage');
    if (message) {
      setFlashMessage(message);
    }
  }, [location]);

  useEffect(() => {
    let noteTimeout;
  
    if (isLoading) {
      noteTimeout = setTimeout(() => {
        setShowNote(true); // Show note after 5 seconds
      }, 5000);
    }
  
    return () => clearTimeout(noteTimeout); // Cleanup the timeout if the component unmounts or login finishes
  }, [isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show spinner when form is submitted

    // Introduce a delay of 10 seconds for testing the spinbar feature
    //await delay(10000);

    fetch(`${API_BASE_URL}/api/login`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        setIsLoading(false); // Hide spinner after response is received
        if (response.ok) {
          return response.json();
        }
        throw new Error('Login failed: invalid username or password');
      })
      .then((data) => {
        navigate(`/home/${data.userId}`);
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorMessage('Login failed: invalid username or password'); // Set error message
      });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Butt Kicker</h1>
      <h2 style={styles.description}>Put smoking in the past</h2>
      {flashMessage && <div style={styles.flashMessage}>{flashMessage}</div>}
      {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>} {/* Display error message */}
      {isLoading ? (
        <div style={styles.spinner}>
          <div style={styles.spinnerInner}></div>
          <p>Login in progress...</p>
          {showNote && <p style={styles.note}>Login may take up to a minute if the server is booting up. Thank you for your patience!</p>}
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            style={styles.input}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      )}
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
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#d3f0ff',
    borderRadius: '10px',
    maxWidth: '500px',
    margin: '50px auto 0 auto',
  },
  title: {
    fontSize: '32px',
    marginBottom: '10px',
    color: '#4B0082',
    textAlign: 'center',
  },
  description: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#4B0082',
    textAlign: 'center',
  },
  flashMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4B0082',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  registerButton: {
    padding: '10px 20px',
    backgroundColor: '#ffa500',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
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

export default Login;