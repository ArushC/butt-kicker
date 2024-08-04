// Profile.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Profile = ({ onClose }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Failed to fetch user data:', error));
  }, [id]);

  const handleLogout = () => {
    // Assuming the logout logic is to navigate to a logout route that handles session clearing
    navigate('/logout');
  };

  const handleChangePassword = () => {
    // Navigate to a change password page or handle inline
    navigate(`/change-password/${id}`);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        backgroundColor: '#243127',
        color: '#fdefc0',
        borderRadius: '10px',
        width: '300px',
        padding: '20px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        fontFamily: 'Futura, Arial, sans-serif',
        zIndex: 1000, // Ensure profile is above overlay
        pointerEvents: 'auto', // Allow interaction with profile content
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: '#a46379',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          textAlign: 'center',
          lineHeight: '30px',
          fontSize: '20px',
          cursor: 'pointer',
        }}
      >
        &times;
      </button>
      <h1>Profile</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Current Streak:</strong> {user.current_streak} days</p>
      <p><strong>Maximum Streak:</strong> {user.max_streak} days</p>
      <p><strong>Location:</strong> {user.location}</p>
      <button 
        onClick={handleChangePassword} 
        style={{
          margin: '10px',
          padding: '10px 20px',
          backgroundColor: '#8f5774',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        Change Password
      </button>
      <button 
        onClick={handleLogout} 
        style={{
          margin: '10px',
          padding: '10px 20px',
          backgroundColor: '#a46379',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
