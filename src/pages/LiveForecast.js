import React from 'react';
import './LiveForecast.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement, // Register the ArcElement for the Doughnut chart
  Title,
  Tooltip,
  Legend
);

function LiveForecast() {
  // Data for the Bar Chart
  const barData = {
    labels: ['Model A', 'Model B', 'Model C'],
    datasets: [
      {
        label: 'Model Effectiveness',
        data: [65, 59, 80],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Data for the Doughnut Chart
  const doughnutData = {
    labels: ['Wins', 'Losses', 'Draws'],
    datasets: [
      {
        label: 'Match Outcomes',
        data: [10, 5, 2],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 205, 86, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255,99,132,1)', 'rgba(255, 205, 86, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // Options for Bar Chart
  const barOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
      },
      y: {
        type: 'linear',
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="App">
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="dashboard-row">
          <div className="chart-container">
            <h2>Model Effectiveness</h2>
            <Bar data={barData} options={barOptions} />
          </div>
          <div className="chart-container">
            <h2>Match Outcomes</h2>
            <Doughnut data={doughnutData} />
          </div>
        </div>
        <div className="dashboard-row">
          <div className="summary-container">
            <h2>Quick Insights</h2>
            <p>Total Matches Analyzed: 17</p>
            <p>Highest Performing Model: Model C</p>
            {/* Add more insights as needed */}
          </div>
          <div className="filter-container">
            <h2>Filters</h2>
            {/* Placeholder for interactive filters. Implement as needed. */}
            <p>Season: <select><option>2023/24</option></select></p>
            {/* Add more filters as needed */}
          </div>
        </div>
        <div className="table-container">
          <h2>EPL Standings</h2>
          {/* Table structure remains the same as before */}
        </div>
      </div>
    </div>
  );
}

export default LiveForecast;
