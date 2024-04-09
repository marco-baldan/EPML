import React, { useState } from 'react';
import { Line } from 'react-chartjs-2'; 
import '../../pages/Dashboard.css'

const ChartContainer = ({ title, chartData, options }) => {
    const [isFullScreen, setIsFullScreen] = useState(false); 
  
    // Function to toggle fullscreen mode
    const toggleFullScreen = () => {
      const chartContainer = document.querySelector(`#${title.toLowerCase().replace(/\s/g, '-')}-chart`); // Select chart container element
      const handleFullScreenChange = () => {
        setIsFullScreen(!!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement)); // Check if fullscreen mode is active
      };
  
      // Toggle fullscreen mode based on current state
      if (!isFullScreen) {
        if (chartContainer.requestFullscreen) {
          chartContainer.requestFullscreen(); // Request fullscreen mode
        } else if (chartContainer.webkitRequestFullscreen) {
          chartContainer.webkitRequestFullscreen();
        } else if (chartContainer.msRequestFullscreen) { 
          chartContainer.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen(); // Exit fullscreen mode
        } else if (document.webkitExitFullscreen) { 
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { 
          document.msExitFullscreen();
        }
      }
      setIsFullScreen(prev => !prev);
  
      // Add event listeners for fullscreen change events
      document.addEventListener('fullscreenchange', handleFullScreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.addEventListener('msfullscreenchange', handleFullScreenChange);
  
      // Add event listener for the 'keydown' event to detect escape key press
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          document.removeEventListener('keydown', handleKeyDown); // Remove event listener
          toggleFullScreen(); // Call toggleFullScreen to exit full screen mode
        }
      };
      document.addEventListener('keydown', handleKeyDown); 
    };
  
    return (
      <div className="chart-container" id={`${title.toLowerCase().replace(/\s/g, '-')}-chart`}>
        <h2 className="chart-title">{title}</h2>
        <button onClick={toggleFullScreen}>{isFullScreen ? 'Exit' : 'Full Screen'}</button>
        {chartData.datasets.length > 0 && (
          <Line data={chartData} options={{ ...options, responsive: true }} />
        )}
      </div>
    );
  };
  
  export default ChartContainer;