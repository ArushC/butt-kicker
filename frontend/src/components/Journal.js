import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

const Journal = () => {
  const { id, dateParam } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState('');
  const date = dateParam !== 'today' ? new Date(dateParam).toLocaleDateString() : new Date().toLocaleDateString();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [entryDates, setEntryDates] = useState([]);

  useEffect(() => {
    fetch(`/api/journal/${id}/${dateParam}`)
      .then(response => response.json())
      .then(data => {
        if (data.entry) {
          setEntry(data.entry);
        }
      })
      .catch(err => console.error('Error fetching journal entry:', err));
  }, [id, dateParam]);

  useEffect(() => {
    fetch(`/api/journal/${id}/dates`)
      .then(response => response.json())
      .then(data => {
        setEntryDates(data);
      })
      .catch(err => console.error('Error fetching journal entry dates:', err));
  }, [id]);

  const handleBlur = () => {
    if (entry.trim() && date === new Date().toLocaleDateString()) {
      fetch(`/api/journal/${id}/today`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ entry })
      }).catch(err => console.error('Error saving journal entry:', err));
    }
  };

  const handleDateClick = (clickedDate) => {
    setModalIsOpen(false);
    const formattedDate = new Date(clickedDate).toLocaleDateString();
    if (formattedDate === new Date().toLocaleDateString()) {
      navigate(`/journal/${id}/today`);
    } else {
      navigate(`/journal/${id}/${clickedDate}`);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#d3f0ff' }}>
      <div style={{ backgroundColor: '#ffffe0', padding: '20px', borderRadius: '10px', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
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
            backgroundColor: 'transparent',
            borderBottom: '1px solid #ccc'
          }}
          value={entry}
          onChange={e => setEntry(e.target.value)}
          onBlur={handleBlur}
          readOnly={dateParam && date !== new Date().toLocaleDateString()}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', width: '100%', maxWidth: '600px', margin: '20px auto 0 auto' }}>
          <button
            style={{
              flex: '1',
              marginRight: '10px',
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
          <button
            style={{
              flex: '1',
              marginLeft: '10px',
              padding: '10px 20px',
              backgroundColor: '#4B0082',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
            onClick={() => setModalIsOpen(true)}
          >
            View A Different Entry
          </button>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="View A Different Entry"
        style={{
          content: {
            backgroundColor: '#d3f0ff',
            padding: '20px',
            borderRadius: '10px',
            width: '80%',
            maxWidth: '400px',
            margin: '0 auto'
          }
        }}
      >
        <h2>View A Different Entry</h2>
        <div>
          {entryDates.map((entryDate, index) => (
            <button
              key={index}
              style={{
                display: 'block',
                margin: '10px auto',
                padding: '10px 20px',
                backgroundColor: '#4B0082',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={() => handleDateClick(entryDate)}
            >
              {new Date(entryDate).toLocaleDateString()}
            </button>
          ))}
        </div>
        <button
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#4B0082',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onClick={() => setModalIsOpen(false)}
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default Journal;
