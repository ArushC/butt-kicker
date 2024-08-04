import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from 'react-modal';

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

      <div style={styles.nextSteps}>
        <h3>Next Steps:</h3>
        <button style={styles.button} onClick={() => navigate(`/journal/${id}/today`)}>
          Reflect and Renew
        </button>
        <button style={styles.button} onClick={() => navigate(`/forum/${id}`)}>
          Talk to Someone
        </button>
        <button style={styles.button} onClick={handleMotivationClick}>
          Get Motivation
        </button>
      </div>

      {showMotivationPopup && (
        <Modal
          isOpen={showMotivationPopup}
          onRequestClose={() => setShowMotivationPopup(false)}
          contentLabel="Motivation Message"
          style={{
            content: {
              backgroundColor: '#d3f0ff',
              padding: '20px',
              borderRadius: '10px',
              width: '80%',
              maxWidth: '400px',
              margin: '0 auto',
              position: 'relative',
              textAlign: 'center'
            },
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.6)'
            }
          }}
        >
          <button style={styles.closeButton} onClick={() => setShowMotivationPopup(false)}>
            &times;
          </button>
          <p>{motivationMessage}</p>
        </Modal>
      )}

      {user && (
        <div style={styles.personalRecord}>
          <p>Personal Record: {user.max_streak} {user.max_streak === 1 ? 'day' : 'days'}</p>
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
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#d3f0ff'
  },
  title: {
    fontSize: '32px',
    marginBottom: '20px',
    color: '#4B0082'
  },
  nextSteps: {
    backgroundColor: '#ffffe0',
    padding: '20px',
    borderRadius: '10px',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  button: {
    display: 'block',
    width: '80%',
    padding: '10px 20px',
    margin: '10px auto',
    backgroundColor: '#4B0082',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '18px',
    cursor: 'pointer'
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
    fontSize: '20px',
    cursor: 'pointer'
  },
  personalRecord: {
    backgroundColor: '#ffffe0',
    padding: '20px',
    borderRadius: '10px',
    width: '100%',
    maxWidth: '600px',
    margin: '20px auto',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  }
};

export default SmokedPage;
