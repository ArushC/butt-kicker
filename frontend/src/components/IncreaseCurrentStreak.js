// IncreaseCurrentStreak.js
import React, { useState } from 'react';
import Confetti from 'react-confetti';

const IncreaseCurrentStreak = ({ onClose }) => {
  const [showConfetti, setShowConfetti] = useState(true);

  // Configure Confetti settings
  const confettiConfig = {
    width: window.innerWidth,
    height: window.innerHeight,
    recycle: false, // Confetti will not restart automatically
    numberOfPieces: 100, // Adjust the number of pieces
    gravity: 0.3, // Adjust gravity to control fall speed
    initialVelocityY: 20, // Initial velocity
    colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00'], // Color options for confetti
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
      {showConfetti && <Confetti {...confettiConfig} />}
      <div style={{
        position: 'relative',
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: '#ff0000',
            color: '#ffffff',
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}>
          &times;
        </button>
        <h1>Congratulations!</h1>
      </div>
    </div>
  );
};

export default IncreaseCurrentStreak;