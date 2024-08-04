import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HomeButton from './HomeButton';
import CheckInModal from './CheckInModal';
import Profile from './Profile';
import IncreaseCurrentStreak from './IncreaseCurrentStreak'; // Import the new component

const Home = ({setIsAuthenticated}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkInTitle, setCheckInTitle] = useState('');
  const [checkInForYesterday, setCheckInForYesterday] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showStreakPopup, setShowStreakPopup] = useState(false); // State to control the popup

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
          fetchUserData(); // Fetch updated user data after state update
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
          fetchUserData(); // Fetch updated user data after successful check-in
          if (data.streak_increased) {
            setShowStreakPopup(true); // Show the congratulations modal
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
      backgroundColor: '#fdefc0',
      onClick: () => {
        setCheckInForYesterday(false);
        setCheckInTitle('Were you smoke-free today?');
        setIsModalOpen(true);
      },
    },
    { text: 'View Savings', backgroundColor: '#fdefc0', onClick: () => navigate(`/savings/${id}`) },
    { text: 'My Journal', backgroundColor: '#fdefc0', onClick: () => navigate(`/journal/${id}/today`) },
    { text: 'Community', backgroundColor: '#fdefc0', onClick: () => navigate(`/forum/${id}`) },
    { text: 'I Smoked', backgroundColor: '#fdefc0', onClick: () => navigate(`/smoked/${id}`) },
  ];

  return (
    <div style={{ position: 'relative', textAlign: 'center', padding: '20px', backgroundColor: '#243127' }}>
      <button
        onClick={toggleProfile}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '5px 15px',
          backgroundColor: '#a46379', // Updated color
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}>
        My Profile
      </button>

      <div style={{ backgroundColor: '#ffdf7c', padding: '20px', borderRadius: '10px' }}> {/* Updated background color */}
        <h1 style={{ color: '#243127' }}>{displayName}'s Streak:</h1> {/* Updated text color */}
        <h2 style={{ color: '#d96d00', fontSize: '48px' }}> {/* Updated streak number color */}
          {user.current_streak} {user.current_streak === 1 ? 'Day' : 'Days'}
        </h2>
      </div>

      <button
        style={{ margin: '20px', padding: '10px 20px', backgroundColor: '#a46379', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
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

      {showProfile && <Profile setIsAuthenticated={setIsAuthenticated}/>}

      {showStreakPopup && (
        <IncreaseCurrentStreak 
          onClose={() => setShowStreakPopup(false)} 
          currentStreak={user.current_streak} // Pass the current streak to the component
        />
      )}
    </div>
  );
};

export default Home;
