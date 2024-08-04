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
  const [modalOpen, setModalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

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

  const interpretSavings = async () => {
    const amountSaved = (streak * averageCigarettes * 0.50).toFixed(2);
    const response = await fetch(
      'https://noggin.rea.gent/aggressive-tyrannosaurus-2172',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer rg_v1_ooknwbh9rwcd0ap99o7iq0p0eqf600md0f17_ngk',
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
    border: '1px solid #a46379',
    width: '100%',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#fdefc0',
    color: '#243127'
  }),
  option: (base, { isFocused }) => ({
    ...base,
    backgroundColor: isFocused ? '#ffdf7c' : '#fdefc0',
    color: '#243127'
  }),
  singleValue: (base) => ({
    ...base,
    color: '#243127'
  })
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#243127',
    borderRadius: '10px',
    maxWidth: '400px',
    margin: 'auto',
    marginTop: '50px',
    fontFamily: 'Futura, Arial, sans-serif',
    color: '#fff'
  },
  title: {
    fontSize: '32px',
    marginBottom: '20px',
    color: '#feb640',
    textAlign: 'center'
  },
  inputGroup: {
    marginBottom: '20px',
    width: '100%',
    textAlign: 'left'
  },
  input: {
    width: 'calc(100% - 22px)', // Adjusted width to fit better within the container
    padding: '10px',
    marginTop: '5px',
    borderRadius: '5px',
    border: '1px solid #a46379',
    backgroundColor: '#fdefc0',
    color: '#243127',
    boxSizing: 'border-box'
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
    border: '1px solid #a46379',
    backgroundColor: '#fdefc0',
    color: '#243127'
  },
  button: {
    padding: '10px',
    backgroundColor: '#a46379',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    width: '40px'
  },
  savingsMessage: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#ffdf7c',
    borderRadius: '10px',
    textAlign: 'center',
    color: '#243127'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '20px'
  },
  navigationButton: {
    padding: '10px 20px',
    backgroundColor: '#feb640',
    color: '#243127',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s',
    textAlign: 'center'
  },
  disabledButton: {
    padding: '10px 20px',
    backgroundColor: '#ddd',
    color: '#888',
    border: 'none',
    borderRadius: '5px',
    cursor: 'not-allowed',
    boxShadow: 'none',
    textAlign: 'center'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    width: '80%',
    maxWidth: '600px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
  },
  closeButton: {
    backgroundColor: '#a46379',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px',
    cursor: 'pointer',
    float: 'right'
  },
  modalTitle: {
    fontSize: '24px',
    marginBottom: '15px',
    color: '#243127'
  },
  suggestionsList: {
    marginTop: '10px'
  },
  suggestionItem: {
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#fdefc0',
    borderRadius: '5px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
  },
  suggestionTitle: {
    fontSize: '18px',
    margin: '0',
    color: '#243127'
  },
  suggestionDescription: {
    fontSize: '16px',
    color: '#243127'
  },
  suggestionCost: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#feb640'
  }
};


export default FinancialSavingsAnalysis;
