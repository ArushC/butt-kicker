import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SmokedPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#d3f0ff', padding: '20px', borderRadius: '10px' }}>
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
          style={buttonStyle} 
          onClick={() => navigate(`/journal/${id}/today`)}
        >
          Reflect and Renew
        </button>

        <button 
          style={{ ...buttonStyle, marginTop: '10px' }} 
          onClick={() => navigate(`/forum/${id}`)}
        >
          Talk to Someone
        </button>
      </div>

      <div style={{ margin: '20px 0' }}>
        <button 
          style={buttonStyle}
        >
          Motivation
        </button>
      </div>

      <div style={{ margin: '20px 0', padding: '20px 0', borderTop: '1px solid black', borderBottom: '1px solid black' }}>
        <p style={{ fontSize: '20px', textDecoration: 'underline' }}>
          Personal Record: 3 days
        </p>
        <button 
          style={{ ...buttonStyle, marginTop: '10px' }} 
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
  backgroundColor: '#F0E68C', // Matching Home.js button background color
  border: '1px solid black',
  borderRadius: '5px',
  fontSize: '18px',
  cursor: 'pointer',
};

export default SmokedPage;
