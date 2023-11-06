import React, {useEffect, useState} from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DataHubImg from './media/pawn.jpg';
import WiksTopPicksImg from './media/wik.jpg';
import LiveForecastImg from './media/ball.jpg';

function Home() {
  return (
    <div className="app">
      <header className="header">
        <h1>SportWhiz</h1>
        <p>AI Predictions delivered in real time</p>
      </header>
      <main className="main-page">
        <div className="content-container">
          <div className="button-container">
            <a href="/data_hub" className="main-button">
              <img className='home-img' src={DataHubImg} alt="DataHubImg" />
              <p>Data Hub</p>
            </a>
            <a href="/wiks_top_picks" className="main-button">
              <img className='home-img' src={WiksTopPicksImg} alt="WiksTopPicksImg" />
              <p>Wiks' Top Picks</p>
            </a>
            <a href="/live_forecast" className="main-button">
              <img className='home-img' src={LiveForecastImg} alt="LiveForecastImg" />
              <p>Live Forecast</p>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

function DataHub() {
  const [matches, setMatches] = useState([]);
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const currentDate = new Date().toISOString().slice(0, 10);
        const response = await fetch(`https://api.football-data.org/v4/matches?dateFrom=${currentDate}&dateTo=${currentDate}`, {
          headers: {
            'X-Auth-Token': 'ff2a5529c13e480eb193185b5e249665',
          },
        });
        const data = await response.json();
        setMatches(data.matches);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };
  fetchMatches();
}, []);

  return (
    <div className='app'>
      <h2>DataHub</h2>
      <p>This is the DataHub page.</p>
      <div className="matches-container">
        {matches.map(match => (
          <div key={match.id} className="match">
            <h3>{match.homeTeam} vs {match.awayTeam}</h3>
            <p>{match.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function WiksTopPicks() {
  return (
    <div className='app'>
      <h2>PowerPicks</h2>
      <p>This is the PowerPicks page.</p>
    </div>
  );

}

function LiveForecast() {
  return (
    <div className='app'>
      <h2>LiveForecast</h2>
      <p>This is the LiveForecast page.</p>
    </div>
  );
}

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
