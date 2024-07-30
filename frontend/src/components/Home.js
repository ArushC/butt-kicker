// src/components/Home.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HomeButton from './HomeButton';

const Home = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then(response => {
        if (response.status === 401) {
          navigate('/login');
        } else {
          return response.json();
        }
      })
      .then(data => setUser(data))
      .catch(() => navigate('/login'));
  }, [id, navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const displayName = user.name || user.username;

  const buttons = [
    { text: 'Daily Check In', backgroundColor: '#F0E68C', onClick: () => console.log('Daily Check In') },
    { text: 'View Savings', backgroundColor: '#F0E68C', onClick: () => navigate(`/savings/${id}`) },
    { text: 'My Journal', backgroundColor: '#F0E68C', onClick: () => navigate(`/journal/${id}/today`) },
    { text: 'Community', backgroundColor: '#F0E68C', onClick: () => console.log('Community') },
    { text: 'I Slipped', backgroundColor: '#F0E68C', onClick: () => console.log('I Slipped') },
  ];

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#d3f0ff', padding: '20px', borderRadius: '10px' }}>
        <h1>{displayName}'s Streak:</h1>
        <h2 style={{ color: '#ffb400', fontSize: '48px' }}>{user.current_streak} DAYS</h2>
      </div>
      <button style={{ margin: '20px', padding: '10px 20px', backgroundColor: '#4B0082', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Check In For Yesterday
      </button>
      <div>
        {buttons.map((btn, index) => (
          <HomeButton
            key={index}
            text={btn.text}
            backgroundColor={btn.backgroundColor}
            onClick={btn.onClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;