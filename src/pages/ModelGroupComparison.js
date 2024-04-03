import React, { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale } from 'chart.js'; // Corrected import
import dataset from '../data/mlmodels/collated_games_data.json';
import './Dashboard.css'; // Import CSS file for styling

Chart.register(BarElement, CategoryScale, LinearScale);

const ModelGroupComparison = ({ dataset }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const chartContainerRef = useRef(null); // Use ref for direct DOM access

  const toggleFullScreen = () => {
    const chartContainer = chartContainerRef.current; // Use ref here
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement != null);
    };

    if (!document.fullscreenElement) {
      chartContainer.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }

    document.addEventListener('fullscreenchange', handleFullScreenChange, false);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  };


  useEffect(() => {
    if (dataset && Array.isArray(dataset)) {
      const modelGroupsComparisonData = processDataForModelGroupsComparison(dataset);
      updateChartData(modelGroupsComparisonData);
    }
  }, [dataset]);

  const processDataForModelGroupsComparison = (data) => {
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format:', data);
      return { labels: [], datasets: [] };
    }

    const modelGroups = {
      'roBERTA': { total: 0, correct: 0 },
      'VADAR': { total: 0, correct: 0 },
      'w/o': { total: 0, correct: 0 },
    };

    data.forEach(game => {
      const actualResult = game.FTR;
      Object.entries(game).forEach(([model, prediction]) => {
        if (model.includes('roberta')) {
          modelGroups['roBERTA'].total++;
          if (prediction === actualResult) {
            modelGroups['roBERTA'].correct++;
          }
        } else if (model.includes('vadar')) {
          modelGroups['VADAR'].total++;
          if (prediction === actualResult) {
            modelGroups['VADAR'].correct++;
          }
        } else if (model.includes('w/o')) {
          modelGroups['w/o'].total++;
          if (prediction === actualResult) {
            modelGroups['w/o'].correct++;
          }
        }
      });
    });

    const labels = Object.keys(modelGroups);
    const datasets = [{
      label: 'Correct Predictions (%)',
      data: labels.map(group => {
        const total = modelGroups[group].total || 1;
        return (modelGroups[group].correct / total) * 100;
      }),
      backgroundColor: ['#4CAF50', '#FFC107', '#2196F3'],
      borderColor: ['#4CAF50', '#FFC107', '#2196F3'],
      borderWidth: 1,
    }];

    return { labels, datasets };
  };

  const updateChartData = (modelGroupsComparisonData) => {
    setChartData(modelGroupsComparisonData);
  };

  return (
    <div className="chart-container" ref={chartContainerRef}>
      <h2 className="chart-title">Model Groups Comparison</h2>
      <button onClick={toggleFullScreen}>{isFullScreen ? 'Exit Full Screen' : 'Toggle Full Screen'}</button>
      {chartData.datasets.length > 0 && (
        <Bar data={chartData} options={{}} />
      )}
    </div>
  );
};

export default ModelGroupComparison;
