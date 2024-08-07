// src/components/HomeButton.js
import React from 'react';

const HomeButton = ({ text, backgroundColor, onClick, textColor }) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        padding: '15px 30px',
        margin: '10px 0',
        backgroundColor: backgroundColor,
        color: textColor, // text color
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