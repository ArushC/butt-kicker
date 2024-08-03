import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';



const CheckInModal = ({ isOpen, onClose, onCheckIn, title }) => {
  //if (!isOpen) return null;

  const navigate = useNavigate(); 
  const { id } = useParams();

  if (!isOpen) return null;

  const handleCheckIn = (smoked) => {
    onCheckIn(smoked);
    onClose();
    if (!smoked) {
      navigate(`/smoked/${id}`);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={onClose}>X</button>
        <h2 style={styles.title}>{title}</h2>
        <div style={styles.buttonContainer}>
          <button style={styles.yesButton} onClick={() => handleCheckIn(true)}>Yes, I was smoke-free</button>
          <button style={styles.noButton} onClick={() => handleCheckIn(false)}>No, I smoked</button>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '10px',
    width: '400px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    position: 'relative',
  },
  closeButton: {
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
    cursor: 'pointer',
  },
  title: {
    margin: '20px 0',
    fontSize: '24px',
    color: '#333',
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
    fontSize: '16px',
    cursor: 'pointer',
    flex: '1',
    margin: '0 10px',
  },
  noButton: {
    backgroundColor: 'orange',  // Changed color back to orange
    color: '#fff',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    flex: '1',
    margin: '0 10px',
  },
};

export default CheckInModal;