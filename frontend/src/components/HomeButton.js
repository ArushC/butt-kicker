import React from 'react';

const HomeButton = ({ text, backgroundColor, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        padding: '12px 20px',
        margin: '10px 0',
        backgroundColor: backgroundColor,
        color: '#EEF3F9', // Light text color
        fontSize: '18px',
        border: 'none',
        borderRadius: '8px',
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
