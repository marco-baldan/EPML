import React, { useState, useEffect } from 'react';
import { Line} from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js'; // Import LineElement
import dataset from '../data/mlmodels/collated_games_data_1.json';
import './Dashboard.css'; // Import CSS file for styling
import { ModelAccuracyCards } from '../components/ModelAccuracyComponents';
import BackButton from '../components/BackButton';
import ModelGroupComparison from './ModelGroupComparison';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend); // Register LineElement

const ChartContainer = ({ title, chartData, options }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    const chartContainer = document.querySelector(`#${title.toLowerCase().replace(/\s/g, '-')}-chart`);
    const handleFullScreenChange = () => {
      setIsFullScreen(!!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement));
    };
  
    if (!isFullScreen) {
      if (chartContainer.requestFullscreen) {
        chartContainer.requestFullscreen();
      } else if (chartContainer.webkitRequestFullscreen) { /* Safari */
        chartContainer.webkitRequestFullscreen();
      } else if (chartContainer.msRequestFullscreen) { /* IE11 */
        chartContainer.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    }
    setIsFullScreen(prev => !prev);
  
    // Add event listener for the 'fullscreenchange' event to detect fullscreen changes
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('msfullscreenchange', handleFullScreenChange);
  
    // Add event listener for the 'keydown' event to detect escape key press
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        document.removeEventListener('keydown', handleKeyDown);
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
        <Line data={chartData} options={options} />
      )}
    </div>
  );
};

const ModelAccuracyChart = ({ dataset }) => {
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  const processData = (data) => {
    const accuracyCounts = {};

    data.forEach((game) => {
      const actualResult = game.FTR;
      Object.entries(game).forEach(([model, prediction]) => {
        if (["roberta", "vadar", "w/o"].some(prefix => model.includes(prefix))) {
          if (!accuracyCounts[model]) {
            accuracyCounts[model] = { correct: 0, total: 0 };
          }
          accuracyCounts[model].total += 1;
          if (prediction === actualResult) {
            accuracyCounts[model].correct += 1;
          }
        }
      });
    });

    const accuracies = Object.keys(accuracyCounts).map(model => ({
      model,
      accuracy: (accuracyCounts[model].correct / accuracyCounts[model].total) * 100
    }));

    // Sort accuracies by accuracy value from lowest to highest
    accuracies.sort((a, b) => a.accuracy - b.accuracy);

    return accuracies;
  };

  const updateChartData = (accuracies) => {
    setChartData({
      labels: accuracies.map(a => a.model),
      datasets: [
        {
          label: 'Model Accuracy (%)',
          data: accuracies.map(a => a.accuracy),
          backgroundColor: ['#4CAF50', '#FFC107', '#2196F3'], // Light green, Amber, Blue
          borderColor: ['#4CAF50', '#FFC107', '#2196F3'],
          borderWidth: 1,
        },
      ],
    });
  };

  useEffect(() => {
    const accuracies = processData(dataset);
    updateChartData(accuracies);
  }, [dataset]);

  return (
    <ChartContainer title="Model Accuracy Chart" chartData={chartData} options={{ scales: { y: { beginAtZero: true } }, responsive: true }} />
  );
};

const TotalAccuracyOverTimeChart = ({ dataset, models }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const accuracyOverTimeData = processDataForTotalAccuracyOverTime(dataset, models);
    updateChartData(accuracyOverTimeData);
  }, [dataset, models]); // Update chart when dataset or models change

  const processDataForTotalAccuracyOverTime = (data, models) => {
    const accuracyByModelAndMonth = {};
  
    // Extract unique months from the dataset
    const uniqueMonths = [...new Set(data.map(game => new Date(game.DateTime).toLocaleString('default', { month: 'long' })))];
  
    // Initialize counters for total predictions by model per month
    const totalPredictionsByModelAndMonth = {};
    models.forEach(model => {
      totalPredictionsByModelAndMonth[model] = {};
      uniqueMonths.forEach(month => {
        totalPredictionsByModelAndMonth[model][month] = 0;
      });
    });
  
    // Iterate through the dataset and aggregate total predictions by model and month
    data.forEach(game => {
      const month = new Date(game.DateTime).toLocaleString('default', { month: 'long' });
      models.forEach(model => {
        const prediction = game[model];
        if (prediction !== undefined) {
          totalPredictionsByModelAndMonth[model][month] += 1;
        }
      });
    });
  
    // Iterate through the dataset again and aggregate accuracy counts by model and month
    data.forEach(game => {
      const month = new Date(game.DateTime).toLocaleString('default', { month: 'long' });
      const actualResult = game.FTR;
      models.forEach(model => {
        const prediction = game[model];
        if (!accuracyByModelAndMonth[model]) {
          accuracyByModelAndMonth[model] = {};
        }
        if (!accuracyByModelAndMonth[model][month]) {
          accuracyByModelAndMonth[model][month] = { correct: 0, total: 0 };
        }
        accuracyByModelAndMonth[model][month].total += 1;
        if (prediction === actualResult) {
          accuracyByModelAndMonth[model][month].correct += 1;
        }
      });
    });
  
    // Calculate average accuracy for each model and month
    const labels = uniqueMonths;
    const datasets = models.map((model, index) => {
      const data = labels.map(month => {
        const totalPredictions = totalPredictionsByModelAndMonth[model][month] || 1; // Prevent division by zero
        const accuracy = accuracyByModelAndMonth[model][month] || { correct: 0, total: 0 };
        return accuracy ? (accuracy.correct / totalPredictions) * 100 : 0;
      });
      return {
        label: model,
        data,
        fill: false,
        borderColor: getRandomColor(index), // Get random color for each line
        borderWidth: 1,
      };
    });
  
    return { labels, datasets };
  };
  
  const updateChartData = (accuracyOverTimeData) => {
    setChartData(accuracyOverTimeData);
  };

  // Function to generate random color
  const getRandomColor = (index) => {
    const colors = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8']; // Add more colors if needed
    return colors[index % colors.length];
  };

  return (
    <ChartContainer title="Total Accuracy Over Time" chartData={chartData} options={{}} />
  );
};

const Dashboard = () => {
  const [models, setModels] = useState([]);

  useEffect(() => {
    // Extract models from dataset and set them
    const modelTypes = ["roberta", "vadar", "w/o"];
    const extractedModels = [];
    dataset.forEach(game => {
      Object.keys(game).forEach(model => {
        if (modelTypes.some(prefix => model.includes(prefix)) && !extractedModels.includes(model)) {
          extractedModels.push(model);
        }
      });
    });
    setModels(extractedModels);
  }, []);
  
  return (
    <div className='app'>
      <BackButton />
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="dashboard-container">
        <ModelAccuracyChart dataset={dataset} />
        <TotalAccuracyOverTimeChart dataset={dataset} models={models} />
        <ModelGroupComparison dataset={dataset} />
        <ModelAccuracyCards dataset={dataset} />
      </div>
    </div>
  );
};

export default Dashboard;