import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import ChartContainer from './ChartContainer';
import '../../pages/Dashboard.css'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const ModelAccuracyChart = ({ dataset }) => {
  const [chartData, setChartData] = useState({ datasets: [] });

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
      labels: accuracies.map(a => {
        let label = a.model;
        if (a.model === "w/o KNN") {
          label = "KNN";
        } else if (a.model === "vadar KNN") {
          label = "KNN + VADER";
        } else if (a.model === "roberta KNN") {
          label = "KNN + roBERTa";
        } else if (a.model === "w/o Naive Bayes") {
          label = "NB";
        } else if (a.model === "vadar Naive Bayes") {
          label = "NB + VADER";
        } else if (a.model === "roberta Naive Bayes") {
          label = "NB + roBERTa";
        } else if (a.model === "w/o L Regress") {
          label = "LR";
        } else if (a.model === "vadar L Regress") {
          label = "LR + VADER";
        } else if (a.model === "roberta L Regress") {
          label = "LR + roBERTa";
        } else if (a.model === "w/o SVM") {
          label = "SVM";
        } else if (a.model === "vadar SVM") {
          label = "SVM + VADER";
        } else if (a.model === "roberta SVM") {
          label = "SVM + roBERTa";
        }
        return label;
      }),
      datasets: [
        {
          label: 'Model Accuracy (%)',
          data: accuracies.map(a => a.accuracy),
          backgroundColor: ['#4CAF50', '#FFC107', '#2196F3'], 
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

export default ModelAccuracyChart;
