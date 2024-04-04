import React from 'react';
import Dashboard from '../media/pawn.jpg';
import LearningCentre from '../media/wik.jpg';
import TotalScores from '../media/ball.jpg';
import './App.css'


function Home() {
    return (
      <div className="app">
        <header className="header">
          <h1>EPML</h1>
          <p>AI Machine Learning EPL Predictions</p>
        </header>
        <main className="main-page">
          <div className="content-container">
            <div className="button-container">
              <a href="/total_scores" className="main-button">
                <img className='home-img' src={TotalScores} alt="Total Scores Thumbnail" />
                <p>Total Scores</p>
              </a>
              <a href="/dashboard" className="main-button">
                <img className='home-img' src={Dashboard} alt="DashboardImg" />
                <p>Dashboard</p>
              </a>
              {/* <a href="/learning_centre" className="main-button">
                <img className='home-img' src={LearningCentre} alt="Learning Centre Thumbnail" />
                <p>Learning Centre</p>
              </a> */}
            </div>
          </div>
        </main>
      </div>
    );
  }
  export default Home;