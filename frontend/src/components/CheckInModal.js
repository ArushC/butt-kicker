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
        <div style={styles.buttonContainer}>
          <button style={styles.yesButton} onClick={() => handleCheckIn(false)}>Yes, I was smoke-free</button>
          <button style={styles.noButton} onClick={() => handleCheckIn(true)}>No, I smoked</button>
        </div>
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
    padding: '40px',
    borderRadius: '10px',
    width: '400px',
    textAlign: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  yesButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  noButton: {
    backgroundColor: '#FFA500',
    color: '#fff',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default CheckInModal;