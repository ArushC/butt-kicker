// IncreaseCurrentStreak.js
import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

const IncreaseCurrentStreak = ({ onClose, currentStreak }) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 1000); // Confetti lasts for 1 second

    return () => clearTimeout(timer);
  }, []);

  // No need for a separate popup timer since the modal stays open until closed by the user

  const handleShare = () => {
    // Logic for sharing the progress, e.g., opening a share dialog or copying to clipboard
    // For demonstration, we'll just log to console
    console.log(`Share progress: Smoke-free for ${currentStreak} days!`);
  };

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
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        maxWidth: '400px',
        width: '100%'
      }}>
        <button
          onClick={onClose}
          style={{
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
          }}
        >
          &times;
        </button>
        <h1 style={{ marginBottom: '20px' }}>
          Congratulations! You have been smoke-free for {currentStreak} days!
        </h1>
        <button
          onClick={handleShare}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4B0082',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Share Your Progress
        </button>
      </div>
    </div>
  );
};

export default IncreaseCurrentStreak;
