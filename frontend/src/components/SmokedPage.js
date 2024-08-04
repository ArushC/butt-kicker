import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SmokedPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [motivationMessage, setMotivationMessage] = useState('');
  const [showMotivationPopup, setShowMotivationPopup] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data to get max_streak
    fetch(`/api/users/${id}`)
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user data:', error));
  }, [id]);

  const handleMotivationClick = async () => {
    try {
      const response = await fetch(
        'https://noggin.rea.gent/current-snipe-5643',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer rg_v1_vhh9gte52dfj2j73efxtswj4imf03bbsq9hp_ngk',
          },
          body: JSON.stringify({ journal: '' }),
        }
      );
      const message = await response.text();
      setMotivationMessage(message);
      setShowMotivationPopup(true);
    } catch (error) {
      console.error('Error fetching motivation message:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>It's okay, keep pushing forward. We believe in you!</h1>
      
      <div style={styles.section}>
        <h3 style={styles.sectionHeader}>Next Steps:</h3>
        <button style={styles.button} onClick={() => navigate(`/journal/${id}/today`)}>
          Reflect and Renew
        </button>
        <button style={styles.orangeButton} onClick={() => navigate(`/forum/${id}`)}>
          Talk to Someone
        </button>
        <button style={styles.greenButton} onClick={handleMotivationClick}>
          Get Motivation
        </button>
      </div>

      {showMotivationPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <button style={styles.closeButton} onClick={() => setShowMotivationPopup(false)}>
              &times;
            </button>
            <p>{motivationMessage}</p>
          </div>
        </div>
      )}

      {user && (
        <div style={styles.section}>
          <h3 style={styles.sectionHeader}>Personal Record: {user.max_streak} {user.max_streak === 1 ? 'day' : 'days'} </h3>
          <button style={styles.button} onClick={() => navigate(`/home/${id}`)}>
            Keep Going
          </button>
        </div>
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
    backgroundColor: '#ffffe0', // yellowish background
    borderRadius: '10px',
    maxWidth: '600px',
    margin: 'auto',
    marginTop: '50px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // added shadow to container
  },
  title: {
    fontSize: '32px',
    marginBottom: '20px',
    color: '#4B0082',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    width: 'calc(100% - 40px)', // reduced width to prevent touching the container edges
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: '30px',
    color: 'black',
    marginBottom: '20px',
  },
  button: {
    display: 'block',
    width: '80%',
    padding: '15px 30px',
    margin: '10px auto',
    backgroundColor: '#4B0082',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '18px',
    cursor: 'pointer',
    textAlign: 'center',
  },
  orangeButton: {
    display: 'block',
    width: '80%',
    padding: '15px 30px',
    margin: '10px auto',
    backgroundColor: '#FFA500', // light orange color
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '18px',
    cursor: 'pointer',
    textAlign: 'center',
  },
  greenButton: {
    display: 'block',
    width: '80%',
    padding: '15px 30px', // increased padding for vertical size
    margin: '10px auto',
    backgroundColor: '#4CAF50', // green color
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '18px',
    cursor: 'pointer',
    textAlign: 'center',
  },
  recordText: {
    fontSize: '24px',
    color: '#4B0082',
    marginBottom: '20px',
  },
  popupOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    width: '300px',
    textAlign: 'center',
    position: 'relative',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'red',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    textAlign: 'center',
    lineHeight: '30px',
    cursor: 'pointer',
  },
};

export default SmokedPage;
