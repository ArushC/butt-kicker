import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import { API_BASE_URL } from '../config';
import { useAuthWithId } from '../useAuth';

const Journal = () => {
  const location = useLocation();
  const notFromHome = location.state?.notFromHome;
  const { id, dateParam } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState('');
  const date = dateParam !== 'today' ? new Date(dateParam).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [entryDates, setEntryDates] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [interimEntry, setInterimEntry] = useState('');
  const phraseTimeoutRef = useRef(null);

  useAuthWithId(id);

  // Define speech recognition setup as a memoized function to prevent re-creation on every render
  const recognition = useMemo(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('SpeechRecognition not supported in this browser.');
      return null;
    }
    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = 'en-US';  // Specify the language as needed

    recog.onresult = event => {
      clearTimeout(phraseTimeoutRef.current); // Clear the previous timeout
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          // Ensure a space is added before the new transcript if there's already text
          finalTranscript += transcript + ' ';
        } else {
          // Update interim results
          setInterimEntry(transcript);
        }
      }
      if (finalTranscript) {
        setEntry(prevEntry => prevEntry.length > 0 ? prevEntry + ' ' + finalTranscript.trim() : finalTranscript.trim());
        setInterimEntry('');
      }
      // Set a new timeout for end of phrase silence
      phraseTimeoutRef.current = setTimeout(() => {
        stopListening();
      }, 5000); // 5000 milliseconds = 5 seconds
    };

    recog.onerror = event => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        alert('Microphone access is denied. Please enable it in your browser settings.');
      }
      setIsListening(false);
    };

    recog.onend = () => {
      setIsListening(false);
      clearTimeout(phraseTimeoutRef.current); // Clear the timeout when recognition ends
    };

    return recog;
  }, []);

  // Effect to start and stop recognition based on isListening
  useEffect(() => {
    if (isListening && recognition) {
      recognition.start();
    } else {
      recognition && recognition.stop();
    }

    // Ensure the recognition is stopped when the component unmounts
    return () => {
      recognition && recognition.stop();
      clearTimeout(phraseTimeoutRef.current);
    };
  }, [isListening, recognition]);

  const startListening = useCallback(() => {
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
    clearTimeout(phraseTimeoutRef.current);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/journal/${id}/${dateParam}`)
      .then(response => response.json())
      .then(data => {
        if (data.entry) {
          setEntry(data.entry);
        }
      })
      .catch(err => console.error('Error fetching journal entry:', err));
  }, [id, dateParam]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/journal/${id}/dates`)
      .then(response => response.json())
      .then(data => {
        setEntryDates(data);
      })
      .catch(err => console.error('Error fetching journal entry dates:', err));
  }, [id]);

  const handleBlur = () => {
    if (entry.trim() && date === new Date().toISOString().split('T')[0]) {
      fetch(`${API_BASE_URL}/api/journal/${id}/today`, {
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
    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#d3f0ff', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#ffffe0', padding: '20px', borderRadius: '10px', width: '100%', maxWidth: '600px', margin: '0 auto', boxSizing: 'border-box' }}>
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
            borderBottom: '1px solid #ccc',
            boxSizing: 'border-box'
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
            {isListening && (
              <div style={{ marginTop: '10px', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
                <strong>Listening...</strong>
                <p>{interimEntry}</p>
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
            onClick={() => notFromHome ? navigate(`/smoked/${id}`) : navigate(`/home/${id}`)}
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
                margin: '10px auto',
                padding: '10px',
                backgroundColor: '#4B0082',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                width: '80%',
                maxWidth: '300px'
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