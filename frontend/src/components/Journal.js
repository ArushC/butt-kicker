import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

const Journal = () => {
  const { id, dateParam } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState('');
  const date = dateParam !== 'today' ? new Date(dateParam).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [entryDates, setEntryDates] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  let phraseTimeout;

  // Speech recognition setup
  const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new speechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  const end_of_phrase_silence_time = 2000; // 2000 milliseconds = 2 seconds

  recognition.onresult = event => {
    clearTimeout(phraseTimeout); // Clear the previous timeout
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        setEntry(prev => prev + ' ' + event.results[i][0].transcript);
      } else {
        setInterimTranscript(event.results[i][0].transcript);
      }
    }
    // Set a new timeout for end of phrase silence
    phraseTimeout = setTimeout(() => {
      stopListening();
    }, end_of_phrase_silence_time);
  };

  recognition.onerror = event => {
    console.error('Speech recognition error', event.error);
    setIsListening(false);
  };

  recognition.onend = () => {
    setIsListening(false);
    setInterimTranscript(''); // Clear interim results when recognition stops
    clearTimeout(phraseTimeout); // Clear the timeout when recognition ends
  };

  const startListening = () => {
    setIsListening(true);
    recognition.start();
    // Set a timeout for end of phrase silence if no sound is detected
    phraseTimeout = setTimeout(() => {
      stopListening();
    }, end_of_phrase_silence_time);
  };

  const stopListening = () => {
    recognition.stop();
    setIsListening(false);
    clearTimeout(phraseTimeout); // Clear the timeout when recognition stops
  };

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
    if (entry.trim() && date === new Date().toISOString().split('T')[0]) {
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
    navigate(`/journal/${id}/${clickedDate}`);
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
          readOnly={dateParam && date !== new Date().toISOString().split('T')[0]}
        />
        {date === new Date().toISOString().split('T')[0] && (
          <div>
            <button
              style={{
                padding: '10px 20px',
                backgroundColor: isListening ? 'red' : '#4B0082',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                margin: '10px 0'
              }}
              onClick={() => isListening ? stopListening() : startListening()}
            >
              {isListening ? 'Stop Listening' : 'Start Voice Entry'}
            </button>
            {interimTranscript && (
              <div style={{ padding: '10px', backgroundColor: '#f0f0f0', color: '#333' }}>
                {interimTranscript}
              </div>
            )}
          </div>
        )}
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
            margin: '0 auto',
            position: 'relative'
          }
        }}
      >
        <button
          style={{
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
            fontSize: '20px',
            cursor: 'pointer'
          }}
          onClick={() => setModalIsOpen(false)}
        >
          &times;
        </button>
        <h2 style={{ textAlign: 'center', marginTop: '40px' }}>View A Different Entry</h2>
        <div>
          {entryDates.map((entryDate, index) => (
            <button
              key={index}
              style={{
                display: 'block',
                width: '100%',
                margin: '10px 0',
                padding: '15px 0',
                backgroundColor: '#4B0082',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
              onClick={() => handleDateClick(entryDate)}
            >
              {entryDate}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Journal;