import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HomeButton from './HomeButton';
import CheckInModal from './CheckInModal';
import Profile from './Profile';
import IncreaseCurrentStreak from './IncreaseCurrentStreak';
import { API_BASE_URL } from '../config';
import { useAuthWithId } from '../useAuth';

const Home = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkInTitle, setCheckInTitle] = useState('');
  const [checkInForYesterday, setCheckInForYesterday] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showStreakPopup, setShowStreakPopup] = useState(false);

  useAuthWithId(id);

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const fetchUserData = () => {
    fetch(`${API_BASE_URL}/api/users/${id}`,
      {credentials: 'include'}
    )
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
    fetch(`${API_BASE_URL}/api/updateState/${id}`, { 
      credentials: 'include', method: 'POST' })
      .then(response => {
        fetchUserData();
        if (!response.ok) {
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
    const endpoint = `${API_BASE_URL}/api/checkin/${id}`;
    const body = checkInForYesterday
      ? { smoke_free_yesterday: smoke_free }
      : { smoke_free_today: smoke_free };

    fetch(endpoint, {
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
          fetchUserData();
          if (data.streak_increased) {
            setShowStreakPopup(true);
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
      textColor: 'black' ,//'#4B0082',
      backgroundColor: '#ffffe0',
      onClick: () => {
        setCheckInForYesterday(false);
        setCheckInTitle('Were you smoke-free today?');
        setIsModalOpen(true);
      },
    },
    { text: 'View Savings', textColor: 'black', backgroundColor: '#ffffe0', onClick: () => navigate(`/savings/${id}`) },
    { text: 'My Journal', textColor: 'black', backgroundColor: '#ffffe0', onClick: () => navigate(`/journal/${id}/today`) },
    { text: 'Community', textColor: 'black', backgroundColor: '#ffffe0', onClick: () => navigate(`/forum/${id}`) },
    { text: 'I Smoked', textColor: 'white', backgroundColor: 'orange', onClick: () => navigate(`/smoked/${id}`) },
  ];

  return (
    <div style={{ position: 'relative', textAlign: 'center', padding: '20px', backgroundColor: '#d3f0ff', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#d3f0ff', padding: '20px', borderRadius: '10px', position: 'relative', boxSizing: 'border-box' }}>
        <h1>{displayName}'s Streak:</h1>
        <h2 style={{ color: '#3B873E', fontSize: '48px', marginBottom: '10px' }}> 
          {user.current_streak} {user.current_streak === 1 ? 'Day' : 'Days'}
        </h2>
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
            boxSizing: 'border-box'
          }}>
          My Profile
        </button>
      </div>

      <button
        style={{ margin: '10px 0 20px', padding: '10px 20px', backgroundColor: '#4B0082', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
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
            textColor={btn.textColor}
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

      {showProfile && <Profile onClose={toggleProfile} />}

      {showStreakPopup && (
        <IncreaseCurrentStreak 
          onClose={() => setShowStreakPopup(false)} 
          currentStreak={user.current_streak}
        />
      )}
    </div>
  );
};

export default Home;
