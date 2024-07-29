// src/components/FinancialSavingsAnalysis.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const FinancialSavingsAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [streak, setStreak] = useState(0);
  const [location, setLocation] = useState('Berkeley');
  const [averageCigarettes, setAverageCigarettes] = useState(3);
  const [cities, setCities] = useState([]);

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
      })
      .catch(() => navigate('/login'));

    fetch('https://countriesnow.space/api/v0.1/countries')
      .then(response => response.json())
      .then(data => {
        const allCities = data.data.reduce((acc, country) => {
          return acc.concat(country.cities);
        }, []);
        setCities(allCities);
      });
  }, [id, navigate]);

  const handleDecrement = () => {
    if (averageCigarettes > 0) setAverageCigarettes(averageCigarettes - 1);
  };

  const handleIncrement = () => {
    setAverageCigarettes(averageCigarettes + 1);
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
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={styles.input}
        >
          {cities.map(city => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
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
        By not smoking for <span>{streak}</span> days in <span>{location}</span>, you avoided smoking <span>{streak * averageCigarettes}</span> cigarettes and saved <span>${(streak * averageCigarettes * 0.50).toFixed(2)}</span>.
      </div>
      <div style={styles.buttonGroup}>
        <button onClick={() => navigate(-1)} style={styles.navigationButton}>Back</button>
        <button onClick={() => alert('Interpreting Savings')} style={styles.navigationButton}>Interpret My Savings</button>
      </div>
    </div>
  );
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
    justifyContent: 'center'
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
    padding: '10px',
    backgroundColor: '#4B0082',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
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
    cursor: 'pointer'
  }
};

export default FinancialSavingsAnalysis;