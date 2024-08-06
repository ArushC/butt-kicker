// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Journal from './components/Journal';
import FinancialSavingsAnalysis from './components/FinancialSavingsAnalysis';
import Forum from './components/Forum';
import SmokedPage from './components/SmokedPage'; // Import SmokedPage component
import { API_BASE_URL } from './config';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/user`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Not authenticated');
      })
      .then((data) => {
        setIsAuthenticated(true);
        sessionStorage.setItem('userId', data.userId);
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to={`/home/${sessionStorage.getItem('userId')}`} /> : <Login setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to={`/home/${sessionStorage.getItem('userId')}`} /> : <Register />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to={`/home/${sessionStorage.getItem('userId')}`} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/home/:id" 
          element={isAuthenticated ? <Home setIsAuthenticated={setIsAuthenticated}/> : <Navigate to="/login" />} 
        />
        <Route 
          path="/savings/:id" 
          element={isAuthenticated ? <FinancialSavingsAnalysis /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/smoked/:id" 
          element={isAuthenticated ? <SmokedPage /> : <Navigate to="/login" />} 
        />
        <Route path="/journal/:id/:dateParam" element={isAuthenticated ? <Journal /> : <Navigate to="/login" />} />
        <Route path="/forum/:id" element={isAuthenticated ? <Forum /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;