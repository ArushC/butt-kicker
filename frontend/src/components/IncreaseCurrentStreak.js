import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import Confetti from 'react-confetti';

const IncreaseCurrentStreak = ({ onClose, currentStreak }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [screenshot, setScreenshot] = useState(null);
  const [randomMessage, setRandomMessage] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000); // Confetti lasts for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchRandomMessage = async () => {
      try {
        const response = await fetch(`/api/random-message/${currentStreak}`);
        if (response.ok) {
          const data = await response.json();
          setRandomMessage(data.message);
        } else {
          console.error('Error fetching random message:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching random message:', error);
      }
    };

    fetchRandomMessage();
  }, [currentStreak]);

  const handleShare = () => {
    // Generate the shareable URL
    const shareText = `I have been smoke-free for ${currentStreak} ${currentStreak === 1 ? 'Day' : 'Days'}! I have been tracking my progress using an app called "Butt Kicker". See https://github.com/ArushC/butt-kicker.`;

    // Example email sharing
    const mailtoLink = `mailto:?subject=My Smoke-Free Progress&body=${encodeURIComponent(shareText)}`;

    // Check if Web Share API is available
    if (navigator.share) {
      if (screenshot) {
        navigator.share({
          title: 'My Smoke-Free Progress',
          text: shareText,
          files: [new File([screenshot], 'screenshot.png', { type: 'image/png' })],
          url: window.location.href,
        })
        .then(() => console.log('Share was successful.'))
        .catch((error) => console.error('Share failed:', error));
      } else {
        navigator.share({
          title: 'My Smoke-Free Progress',
          text: shareText,
          url: window.location.href,
        })
        .then(() => console.log('Share was successful.'))
        .catch((error) => console.error('Share failed:', error));
      }
    } else {
      // Fallback to email
      window.location.href = mailtoLink;
    }
  };

  const captureScreenshot = () => {
    html2canvas(document.body).then(canvas => {
      setScreenshot(canvas.toDataURL('image/png'));
    });
  };

  useEffect(() => {
    captureScreenshot();
  }, []);

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
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} gravity={5} />}
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
      Congratulations! You have been smoke-free for {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}!
      <br />
      {randomMessage}
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
