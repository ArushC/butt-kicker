import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HomeButton from './HomeButton';
import CheckInModal from './CheckInModal';
import Profile from './Profile';
import IncreaseCurrentStreak from './IncreaseCurrentStreak';

const Home = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkInTitle, setCheckInTitle] = useState('');
  const [checkInForYesterday, setCheckInForYesterday] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const fetchUserData = () => {
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
  };

  useEffect(() => {
    fetchUserData();
    fetch(`/api/updateState/${id}`, { method: 'POST' })
      .then(response => {
        if (response.ok) {
          fetchUserData();
        } else {
          console.error('State update failed');
        }
      })
      .catch(error => {
        console.error('State update failed', error);
      });
  }, [id, navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const displayName = user.name || user.username;

  const handleCheckIn = (smoke_free) => {
    const endpoint = `/api/checkin/${id}`;
    const body = checkInForYesterday
      ? { smoke_free_yesterday: smoke_free }
      : { smoke_free_today: smoke_free };

    fetch(endpoint, {
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
          fetchUserData();
          if (data.streak_increased) {
            setShowStreakModal(true);
          }
        } else {
          console.error('Check-in failed');
        }
      })
      .catch(error => {
        console.error('Check-in failed', error);
      });
  };

  const buttons = [
    {
      text: 'Daily Check In',
      backgroundColor: '#F0E68C',
      onClick: () => {
        setCheckInForYesterday(false);
        setCheckInTitle('Were you smoke-free today?');
        setIsModalOpen(true);
      },
    },
    { text: 'View Savings', backgroundColor: '#F0E68C', onClick: () => navigate(`/savings/${id}`) },
    { text: 'My Journal', backgroundColor: '#F0E68C', onClick: () => navigate(`/journal/${id}/today`) },
    { text: 'Community', backgroundColor: '#F0E68C', onClick: () => navigate(`/forum/${id}`) },
    { text: 'I Smoked', backgroundColor: '#F0E68C', onClick: () => navigate(`/smoked/${id}`) },
  ];

  return (
    <div style={{ position: 'relative', textAlign: 'center', padding: '20px' }}>
      <button
        onClick={toggleProfile}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '5px 15px',
          backgroundColor: '#4B0082',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}>
        My Profile
      </button>

      <div style={{ backgroundColor: '#d3f0ff', padding: '20px', borderRadius: '10px' }}>
        <h1>{displayName}'s Streak:</h1>
        <h2 style={{ color: '#ffb400', fontSize: '48px' }}>{user.current_streak} DAYS</h2>
      </div>

      <button
        style={{ margin: '20px', padding: '10px 20px', backgroundColor: '#4B0082', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        onClick={() => {
          setCheckInForYesterday(true);
          setCheckInTitle('Were you smoke-free yesterday?');
          setIsModalOpen(true);
        }}
      >
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

      <CheckInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCheckIn={handleCheckIn}
        title={checkInTitle}
      />

      {showProfile && <Profile />}

      {showStreakModal && (
        <IncreaseCurrentStreak onClose={() => setShowStreakModal(false)} />
      )}
    </div>
  );
};

export default Home;