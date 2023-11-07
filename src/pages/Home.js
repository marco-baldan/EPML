import React from 'react';
import DataHubImg from '../media/pawn.jpg';
import WiksTopPicksImg from '../media/wik.jpg';
import LiveForecastImg from '../media/ball.jpg';
import './App.css'


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
  export default Home;