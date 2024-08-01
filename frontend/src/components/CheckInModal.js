// src/components/CheckInModal.js
import React from 'react';

const CheckInModal = ({ isOpen, onClose, onCheckIn, title }) => {
  if (!isOpen) return null;

  const handleCheckIn = (smoked) => {
    onCheckIn(smoked);
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={onClose}>X</button>
        <h2>{title}</h2>
        <button style={styles.yesButton} onClick={() => handleCheckIn(false)}>Yes, I was smoke-free</button>
        <button style={styles.noButton} onClick={() => handleCheckIn(true)}>No, I smoked</button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    width: '300px',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
  },
  yesButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    margin: '10px',
    cursor: 'pointer',
  },
  noButton: {
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    margin: '10px',
    cursor: 'pointer',
  },
};

export default CheckInModal;