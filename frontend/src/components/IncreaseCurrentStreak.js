// IncreaseCurrentStreak.js
//This popup gets displayed if the user's current streak increases
import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

const IncreaseCurrentStreak = ({ onClose }) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 1000); // Confetti lasts for 1 second

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const popupTimer = setTimeout(() => {
      onClose();
    }, 3000); // Popup closes after 3 seconds

    return () => clearTimeout(popupTimer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
    }}>
      {showConfetti && <Confetti />}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      }}>
        <h1>Congratulations!</h1>
      </div>
    </div>
  );
};

export default IncreaseCurrentStreak;
