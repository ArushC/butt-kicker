import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';

const FinancialSavingsAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [streak, setStreak] = useState(0);
  const [location, setLocation] = useState('');
  const [averageCigarettes, setAverageCigarettes] = useState(3);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    fetch(`/api/users/${id}`)
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

    fetch('/api/cities')
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
    fetch(`/api/users/${id}/location`, {
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
        <button onClick={() => alert('Interpreting Savings')} style={isInterpretSavingsDisabled ? styles.disabledButton : styles.navigationButton} disabled={isInterpretSavingsDisabled}>Interpret My Savings</button>
      </div>
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#d3f0ff',
    borderRadius: '10px',
    maxWidth: '400px',
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
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc'
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
  }
};

export default FinancialSavingsAnalysis;