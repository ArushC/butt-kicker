import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { API_BASE_URL } from '../config';

const FinancialSavingsAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [streak, setStreak] = useState(0);
  const [location, setLocation] = useState('');
  const [averageCigarettes, setAverageCigarettes] = useState(3);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/users/${id}`, {
      credentials: 'include'
    })
      .then(response => {
        if (response.status === 401) {
          navigate('/login');
        } else {
          return response.json();
        }
      })
      .then(data => {
        setStreak(data.current_streak);
        if (data.location) {
          setLocation({ value: data.location, label: data.location });
        }
      })
      .catch(() => navigate('/login'));

    fetch(`${API_BASE_URL}/api/cities`,
      {
        credentials: 'include'
      }
    )
      .then(response => response.json())
      .then(data => {
        const cityOptions = data.map(city => ({ value: city, label: city }));
        setCities(cityOptions);
        setFilteredCities([]);
      })
      .catch(error => {
        console.error('Error fetching cities:', error);
      });
  }, [id, navigate]);

  const isInterpretSavingsDisabled = location === '' || averageCigarettes * streak === 0;

  const handleDecrement = () => {
    if (averageCigarettes > 0) setAverageCigarettes(averageCigarettes - 1);
  };

  const handleIncrement = () => {
    setAverageCigarettes(averageCigarettes + 1);
  };

  const handleCityChange = selectedOption => {
    setLocation(selectedOption);
    // Update the location in the database
    fetch(`${API_BASE_URL}/api/users/${id}/location`, {
      credentials: 'include',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ location: selectedOption.value })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update location');
      }
    })
    .catch(error => {
      console.error('Error updating location:', error);
    });
  };

  const handleInputChange = (inputValue) => {
    setSearchValue(inputValue);
    if (inputValue) {
      const filtered = cities.filter(city =>
        city.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  };

  const handleMenuOpen = () => {
    setLocation('');
  };

  const interpretSavings = async () => {
    const amountSaved = (streak * averageCigarettes * 0.50).toFixed(2);
    const response = await fetch(
      'https://noggin.rea.gent/only-viper-1649',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer rg_v1_tjn7qu6ai78dphc8wl83aluxu08y58etlw50_ngk',
        },
        body: JSON.stringify({
          savings: amountSaved,
          location: location.value,
        }),
      }
    ).then(response => response.text());
    console.log(response);
    const data = JSON.parse(response);
    setSuggestions(data);
    setModalOpen(true);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Financial Savings Analysis</h1>
      <div style={styles.inputGroup}>
        <label>Streak:</label>
        <input
          type="text"
          value={streak}
          readOnly
          style={styles.input}
        />
      </div>
      <div style={styles.inputGroup}>
        <label>Location:</label>
        <Select
          value={location}
          onChange={handleCityChange}
          onInputChange={handleInputChange}
          inputValue={searchValue}
          onMenuOpen={handleMenuOpen}
          options={filteredCities}
          styles={customSelectStyles}
        />
      </div>
      <div style={styles.inputGroup}>
        <label>Average Cigarettes Smoked Each Day:</label>
        <div style={styles.cigaretteInput}>
          <button onClick={handleDecrement} style={styles.button}>-</button>
          <input
            type="text"
            value={averageCigarettes}
            readOnly
            style={styles.cigaretteCount}
          />
          <button onClick={handleIncrement} style={styles.button}>+</button>
        </div>
      </div>
      <div style={styles.savingsMessage}>
        By not smoking for <span>{streak}</span> days in <span>{location.label}</span>, you avoided smoking <span>{streak * averageCigarettes}</span> cigarettes and saved <span>${(streak * averageCigarettes * 0.50).toFixed(2)}</span>.
      </div>
      <div style={styles.buttonGroup}>
        <button onClick={() => navigate('/')} style={styles.navigationButton}>Back</button>
        <button 
          onClick={interpretSavings} 
          style={isInterpretSavingsDisabled ? styles.disabledButton : styles.navigationButton} 
          disabled={isInterpretSavingsDisabled}
        >
          Interpret My Savings
        </button>
      </div>
      {modalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <button style={styles.closeButton} onClick={() => setModalOpen(false)}>X</button>
            <h2 style={styles.modalTitle}>Here are suggestions for things to do with ${((streak * averageCigarettes * 0.50).toFixed(2))} in {location.label}:</h2>
            <div style={styles.suggestionsList}>
              {Object.keys(suggestions).map(key => (
                <div key={key} style={styles.suggestionItem}>
                  <h3 style={styles.suggestionTitle}>{suggestions[key].suggestion}</h3>
                  <p style={styles.suggestionDescription}>{suggestions[key].description}</p>
                  <p style={styles.suggestionCost}>Cost: {suggestions[key].cost}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const customSelectStyles = {
  control: (base) => ({
    ...base,
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%'
  })
};

const button = {
  padding: '10px',
  backgroundColor: '#4B0082',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

const styles = {
  container: {
    backgroundColor: '#d3f0ff',
    padding: '30px', // Increased padding
    borderRadius: '10px',
    width: '100%',
    height: '100vh',
    margin: '0',
    position: 'relative',
    boxSizing: 'border-box'
  },
  title: {
    fontSize: '32px',
    marginBottom: '30px', // Increased margin
    color: '#4B0082',
    textAlign: 'center'
  },
  inputGroup: {
    marginBottom: '30px', // Increased margin
    width: '50%', // Reduced width
    textAlign: 'left',
    margin: '0 auto' // Center the input group
  },
  input: {
    width: '100%',
    padding: '15px', // Increased padding
    marginTop: '10px', // Increased margin
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  cigaretteInput: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: '20px' // Added spacing
  },
  cigaretteCount: {
    width: '25px', // Reduced width
    textAlign: 'center',
    padding: '10px',
    margin: '0 15px', // Increased margin
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  button: {
    ...button,
    width: '20px' // Reduced width for button
  },
  savingsMessage: {
    marginTop: '30px', // Increased margin
    padding: '20px',
    backgroundColor: '#ffffe0',  // Updated color
    borderRadius: '10px',
    textAlign: 'center',
    color: '#856404',
    width: '50%', // Reduced width
    margin: '0 auto' // Center the savings message
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-around', // Space between buttons
    width: '50%', // Reduced width
    marginTop: '30px', // Increased margin
    margin: '0 auto' // Center the button group
  },
  navigationButton: {
    padding: '15px 25px', // Increased padding
    backgroundColor: '#ffa500',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex', // ensure flex display for consistency
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 10px' // Added margin
  },
  disabledButton: {
    ...button,
    backgroundColor: '#A9A9A9', // A different color to indicate disabled state
    cursor: 'not-allowed',
    opacity: 0.5, // To give a visual cue that the button is disabled
    width: 'auto', // ensure width is consistent with navigationButton
    padding: '15px 25px', // Increased padding
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 10px' // Added margin
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    backgroundColor: '#fff',
    padding: '30px', // Increased padding
    borderRadius: '10px',
    maxWidth: '500px',
    width: '100%',
    position: 'relative'
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
    cursor: 'pointer'
  },
  modalTitle: {
    fontSize: '24px',
    marginBottom: '30px', // Increased margin
    color: '#4B0082'
  },
  suggestionsList: {
    maxHeight: '300px',
    overflowY: 'auto'
  },
  suggestionItem: {
    marginBottom: '20px', // Increased margin
    padding: '15px', // Increased padding
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
    border: '1px solid #ddd'
  },
  suggestionTitle: {
    fontSize: '18px',
    marginBottom: '10px', // Increased margin
    color: '#4B0082'
  },
  suggestionDescription: {
    marginBottom: '10px', // Increased margin
    color: '#555'
  },
  suggestionCost: {
    color: '#555'
  }
};

export default FinancialSavingsAnalysis;
