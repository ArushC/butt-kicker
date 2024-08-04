import React from 'react';

const MotivationPopup = ({ message, onClose }) => {
  return (
    <div style={styles.popupOverlay}>
      <div style={styles.popup}>
        <button style={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h1 style={styles.title}>You're Doing Great!</h1>
        <p style={styles.message}>{message}</p>
        <div style={styles.iconContainer}>
          <span style={styles.icon}>🌟</span> {/* Star icon for motivation */}
        </div>
      </div>
    </div>
  );
};

const styles = {
  popupOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for contrast
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: '#ffffff', // Consistent with the rest of the page
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', // Subtle shadow
    position: 'relative',
    maxWidth: '400px',
    width: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#FF0000', // Red for consistency with your design
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    textAlign: 'center',
    lineHeight: '30px',
    fontSize: '20px',
    cursor: 'pointer',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#4B0082', // Dark indigo for consistency with the page title
    marginBottom: '15px',
  },
  message: {
    fontSize: '20px',
    fontWeight: '500',
    color: '#4CAF50', // Green for positive reinforcement
    marginBottom: '20px',
    padding: '0 20px',
  },
  iconContainer: {
    marginTop: '20px',
  },
  icon: {
    fontSize: '48px', // Larger size for visual impact
    color: '#4B0082', // Matching the title color
  },
};

export default MotivationPopup;
