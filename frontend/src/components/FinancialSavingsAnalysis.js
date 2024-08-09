import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { API_BASE_URL } from '../config';
import { useAuthWithId } from '../useAuth';

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
  const [isLoading, setIsLoading] = useState(false);

  useAuthWithId(id);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/users/${id}`,
      {credentials: 'include'}
    )
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

    fetch(`${API_BASE_URL}/api/cities`, { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        const cityOptions = data.map(city => ({ value: city, label: city }));
        setCities(cityOptions);
        setFilteredCities([]);
      })
      .catch(error => console.error('Error fetching cities:', error));
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
    fetch(`${API_BASE_URL}/api/users/${id}/location`, {
      credentials: 'include',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location: selectedOption.value })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update location');
      }
    })
    .catch(error => console.error('Error updating location:', error));
  };

  const handleInputChange = inputValue => {
    setSearchValue(inputValue);
    setFilteredCities(cities.filter(city => city.label.toLowerCase().includes(inputValue.toLowerCase())));
  };

  const handleMenuOpen = () => {
    setLocation('');
  };

  const interpretSavings = async () => {
    setIsLoading(true);
    const amountSaved = (streak * averageCigarettes * 0.50).toFixed(2);
    try {
      const response = await fetch('https://noggin.rea.gent/only-viper-1649', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer rg_v1_tjn7qu6ai78dphc8wl83aluxu08y58etlw50_ngk',
        },
        body: JSON.stringify({ savings: amountSaved, location: location.value }),
      });
      const data = await response.text();
      setSuggestions(JSON.parse(data));
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const Spinner = () => (
    <div style={styles.spinner}>
      <div style={styles.spinnerInner}></div>
    </div>
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Financial Savings Analysis</h1>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Streak:</label>
            <input type="text" value={streak} readOnly style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Location:</label>
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
            <label style={styles.label}>Average Cigarettes Smoked Each Day:</label>
            <div style={styles.cigaretteInput}>
              <button onClick={handleDecrement} style={styles.button}>-</button>
              <input type="text" value={averageCigarettes} readOnly style={styles.cigaretteCount} />
              <button onClick={handleIncrement} style={styles.button}>+</button>
            </div>
          </div>
          <div style={styles.savingsMessage}>
  By not smoking for <span>{streak}</span> {streak === 1 ? 'day' : 'days'} in <span>{location.label}</span>, you avoided smoking <span>{streak * averageCigarettes}</span> {streak * averageCigarettes === 1 ? 'cigarette' : 'cigarettes'} and saved <span>${(streak * averageCigarettes * 0.50).toFixed(2)}</span>.
        </div>
          <div style={styles.buttonGroup}>
            <button onClick={() => navigate(`/home/${id}`)} style={styles.navigationButton}>Back</button>
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
        </>
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
  // Include spinner styles here
  spinner: {
    display: 'flex',
    maxWidth: '500px',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Full screen height
  },
  spinnerInner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 2s linear infinite'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#d3f0ff',
    borderRadius: '10px',
    maxWidth: '500px',
    margin: 'auto',
    marginTop: '50px'
  },
  title: {
    fontSize: '32px',
    marginBottom: '20px',
    color: '#4B0082',
    textAlign: 'center'
  },
  inputGroup: {
    marginBottom: '20px',
    width: '100%',
    textAlign: 'left'
  },
  input: {
    width: '100%', // Ensures the streak input takes the full width of its container
    padding: '10px',
    marginTop: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box' // Ensures padding is included in the element's width
  },
  cigaretteInput: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  cigaretteCount: {
    width: '50px',
    textAlign: 'center',
    padding: '10px',
    margin: '0 10px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  button: {
    ...button,
    width: '40px' // explicitly set width to 40px for button
  },
  savingsMessage: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#fff3cd',
    borderRadius: '10px',
    textAlign: 'center',
    color: '#856404'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '20px'
  },
  navigationButton: {
    padding: '10px 20px',
    backgroundColor: '#ffa500',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex', // ensure flex display for consistency
    alignItems: 'center',
    justifyContent: 'center'
  },
  disabledButton: {
    ...button,
    backgroundColor: '#A9A9A9', // A different color to indicate disabled state
    cursor: 'not-allowed',
    opacity: 0.5, // To give a visual cue that the button is disabled
    width: 'auto', // ensure width is consistent with navigationButton
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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
    backgroundColor: '#ffffe0', // Changed from '#fff' to '#ffffe0'
    padding: '20px',
    borderRadius: '10px',
    maxWidth: '500px',
    width: '100%',
    position: 'relative'
  },
  label: {
    display: 'block',
    marginBottom: '5px', // add this to increase space between label and the element below
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
    marginBottom: '20px',
    color: '#4B0082'
  },
  suggestionsList: {
    maxHeight: '300px',
    overflowY: 'auto'
  },
  suggestionItem: {
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
    border: '1px solid #ddd'
  },
  suggestionTitle: {
    fontSize: '18px',
    marginBottom: '5px',
    color: '#4B0082'
  },
  suggestionDescription: {
    marginBottom: '5px',
    color: '#555'
  },
  suggestionCost: {
    color: '#555'
  }
};

export default FinancialSavingsAnalysis;