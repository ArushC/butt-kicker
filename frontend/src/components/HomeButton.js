// src/components/HomeButton.js
import React from 'react';

const HomeButton = ({ text, backgroundColor, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        padding: '10px 20px',
        margin: '10px 0',
        backgroundColor: backgroundColor,
        color: '#4B0082', // Indigo color for text
        fontSize: '18px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'background-color 0.3s',
      }}
    >
      {text}
    </button>
  );
};

export default HomeButton;