import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DataHub from './pages/DataHub'; // Use 'Datahub' instead of 'DataHub'
import WiksTopPicks from './pages/WiksTopPicks';
import LiveForecast from './pages/LiveForecast';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/data_hub" element={<DataHub />} />
        <Route path="/wiks_top_picks" element={<WiksTopPicks />} />
        <Route path="/live_forecast" element={<LiveForecast />} />
      </Routes>
    </Router>
  );
}

export default App;
