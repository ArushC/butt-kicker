// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch('/api/user')
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
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;