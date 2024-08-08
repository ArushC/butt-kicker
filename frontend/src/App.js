// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Journal from './components/Journal';
import FinancialSavingsAnalysis from './components/FinancialSavingsAnalysis';
import Forum from './components/Forum';
import SmokedPage from './components/SmokedPage'; // Import SmokedPage component

const App = () => {

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={<Login />} 
        />
        <Route 
          path="/register" 
          element={<Register />} 
        />
        <Route
        path="/"
        element={sessionStorage.getItem('userId') ? <Navigate to={`/home/${sessionStorage.getItem('userId')}`} /> 
        : <Navigate to="/login" />}
        />
        <Route 
          path="/home/:id" 
          element={ <Home />}
        />
        <Route 
          path="/savings/:id" 
          element={<FinancialSavingsAnalysis />}
        />
        <Route 
          path="/smoked/:id" 
          element={<SmokedPage /> } 
        />
        <Route path="/journal/:id/:dateParam" element={<Journal />} />
        <Route path="/forum/:id" element={<Forum /> } />
      </Routes>
    </Router>
  );
}

export default App;