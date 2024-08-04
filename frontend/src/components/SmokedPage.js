import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SmokedPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [motivationMessage, setMotivationMessage] = useState('');
  const [showMotivationPopup, setShowMotivationPopup] = useState(false);

  const handleMotivationClick = async () => {
    const response = await fetch(
      'https://noggin.rea.gent/current-snipe-5643',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer rg_v1_vhh9gte52dfj2j73efxtswj4imf03bbsq9hp_ngk',
        },
        body: JSON.stringify({
          "journal": "",
        }),
      }
    ).then(response => response.text());

    setMotivationMessage(response);
    setShowMotivationPopup(true);
  };

  return (
    <div style={{ position: 'relative', textAlign: 'center', padding: '20px', backgroundColor: '#243127', color: '#fff', minHeight: '100vh', fontFamily: 'Futura, Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#fdefc0', padding: '20px', borderRadius: '10px', color: '#243127' }}>
        <h1 style={{ display: 'none' }}>I Smoked Page</h1>
        <p style={{ fontSize: '24px', margin: '20px 0' }}>
          That’s ok. Keep on pushing forward and making progress. We believe in you.
        </p>
        <h2 style={{ textDecoration: 'underline', margin: '20px 0' }}>
          Next Steps:
        </h2>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button 
          style={{ ...buttonStyle, backgroundColor: '#feb640', color: '#243127' }} 
          onClick={() => navigate(`/journal/${id}/today`)}
        >
          Reflect and Renew
        </button>

        <button 
          style={{ ...buttonStyle, backgroundColor: '#fdefc0', color: '#243127', marginTop: '10px' }} 
          onClick={() => navigate(`/forum/${id}`)}
        >
          Talk to Someone
        </button>
      </div>

      <div style={{ margin: '20px 0' }}>
        <button 
          style={{ ...buttonStyle, backgroundColor: '#a46379', color: '#fff' }}
          onClick={handleMotivationClick}
        >
          Motivation
        </button>
      </div>

      {showMotivationPopup && (
        <div style={popupStyles.overlay}>
          <div style={popupStyles.popup}>
            <button style={popupStyles.closeButton} onClick={() => setShowMotivationPopup(false)}>X</button>
            <p>{motivationMessage}</p>
          </div>
        </div>
      )}

      <div style={{ margin: '20px 0', padding: '20px 0', borderTop: '1px solid #fff', borderBottom: '1px solid #fff' }}>
        <p style={{ fontSize: '20px', textDecoration: 'underline' }}>
          Personal Record: 3 days
        </p>
        <button 
          style={{ ...buttonStyle, backgroundColor: '#ffdf7c', color: '#243127', marginTop: '10px' }} 
          onClick={() => navigate(`/home/${id}`)}
        >
          Keep Going
        </button>
      </div>
    </div>
  );
};

const buttonStyle = {
  display: 'block',
  width: '200px',
  padding: '10px 20px',
  margin: '10px auto',
  border: 'none',
  borderRadius: '5px',
  fontSize: '18px',
  cursor: 'pointer',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
};

const popupStyles = {
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
  popup: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    width: '300px',
    textAlign: 'center',
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
};

export default SmokedPage;
