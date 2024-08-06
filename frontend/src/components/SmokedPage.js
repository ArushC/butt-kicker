import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MotivationPopup from './MotivationPopup'; // import the new component
import { API_BASE_URL } from '../config';

const SmokedPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [motivationMessage, setMotivationMessage] = useState('');
  const [showMotivationPopup, setShowMotivationPopup] = useState(false);
  const [user, setUser] = useState(null);
  const notFromHome = true;

  useEffect(() => {
    const body = { smoke_free_today: false };
    //Reset the user's streak to 0 by checking in as not smoke-free for today
    fetch(`${API_BASE_URL}/api/checkin/${id}`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Check-in successful');
        } else {
          console.error('Check-in failed');
        }
      })
      .catch(error => {
        console.error('Check-in failed', error);
      });
  }, [id]);

  useEffect(() => {
    // Fetch user data to get max_streak
    fetch(`${API_BASE_URL}/api/users/${id}`,
      {credentials: 'include'}
    )
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user data:', error));
  }, [id]);

  const handleMotivationClick = async () => {
    try {
      // Fetch the journal entries from your backend API
      const response = await fetch(`${API_BASE_URL}/api/journal/${id}/formatted-journal-entries`,
        {credentials: 'include'}
      );
      const data = await response.json();

      // Send the formatted journal to the motivation endpoint
      const motivationResponse = await fetch('https://noggin.rea.gent/current-snipe-5643', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer rg_v1_vhh9gte52dfj2j73efxtswj4imf03bbsq9hp_ngk',
        },
        body: JSON.stringify({ journal: data.journal }),
      });

      const message = await motivationResponse.text();
      setMotivationMessage(message);
      setShowMotivationPopup(true);
    } catch (error) {
      console.error('Error fetching motivation message:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>That's okay. Keep pushing forward and making progress. We believe in you!</h1>
      
      <div style={styles.section}>
        <h3 style={styles.sectionHeader}>Next Steps:</h3>
        <button style={styles.button} onClick={() => navigate(`/journal/${id}/today`, { state: { notFromHome } })}>
          Reflect and Renew
        </button>
        <button style={styles.orangeButton} onClick={() => navigate(`/forum/${id}`, { state: { notFromHome } })}>
          Talk to Someone
        </button>
        <button style={styles.greenButton} onClick={handleMotivationClick}>
          Get Motivation
        </button>
      </div>
      

      {showMotivationPopup && (
        <MotivationPopup
          message={motivationMessage}
          onClose={() => setShowMotivationPopup(false)}
        />
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
};

export default SmokedPage;
