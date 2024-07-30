// src/components/Journal.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Journal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString());

  useEffect(() => {
    fetch(`/api/journal/${id}/today`)
      .then(response => response.json())
      .then(data => {
        if (data.entry) {
          setEntry(data.entry);
        }
      })
      .catch(err => console.error('Error fetching journal entry:', err));
  }, [id]);

  const handleBlur = () => {
    if (entry.trim()) {
      fetch(`/api/journal/${id}/today`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ entry })
      }).catch(err => console.error('Error saving journal entry:', err));
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#d3f0ff' }}>
      <div style={{ backgroundColor: '#ffffe0', padding: '20px', borderRadius: '10px', position: 'relative', width: '50%', margin: '0 auto' }}>
        <div style={{ textAlign: 'right', padding: '5px', cursor: 'pointer' }}>
          <span onClick={() => navigate(-1)} style={{ color: 'red', fontWeight: 'bold' }}>X</span>
        </div>
        <div>
          <h2>{date}</h2>
          <textarea
            style={{
              width: '100%',
              height: '400px',
              padding: '10px',
              fontSize: '16px',
              lineHeight: '1.5',
              border: 'none',
              outline: 'none',
              resize: 'none',
              backgroundColor: 'transparent'
            }}
            value={entry}
            onChange={e => setEntry(e.target.value)}
            onBlur={handleBlur}
          />
        </div>
      </div>
      <button
        style={{
          margin: '20px',
          padding: '10px 20px',
          backgroundColor: '#4B0082',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
        onClick={() => navigate('/')}
      >
        Back
      </button>
    </div>
  );
};

export default Journal;