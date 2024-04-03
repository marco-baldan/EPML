import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TotalScores from './pages/TotalScores'; 
import LearningCentre from './pages/LearningCentre';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/total_scores" element={<TotalScores />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/learning_centre" element={<LearningCentre />} />
      </Routes>
    </Router>
  );
}

export default App;
