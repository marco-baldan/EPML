import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2'; 
import ChartContainer from './ChartContainer'; 
import '../../pages/Dashboard.css'


const TotalAccuracyOverTimeChart = ({ dataset, models }) => {
    const [chartData, setChartData] = useState({
      labels: [],
      datasets: [],
    });
  
    useEffect(() => {
      const processDataForTotalAccuracyOverTime = (data, models) => {
        const accuracyByModelAndMonth = {};
      
        const uniqueMonths = [...new Set(data.map(game => new Date(game.DateTime).toLocaleString('default', { month: 'long' })))];
      
        const totalPredictionsByModelAndMonth = {};
        models.forEach(model => {
          totalPredictionsByModelAndMonth[model] = {};
          uniqueMonths.forEach(month => {
            totalPredictionsByModelAndMonth[model][month] = 0;
          });
        });
      
        data.forEach(game => {
          const month = new Date(game.DateTime).toLocaleString('default', { month: 'long' });
          models.forEach(model => {
            const prediction = game[model];
            if (prediction !== undefined) {
              totalPredictionsByModelAndMonth[model][month] += 1;
            }
          });
        });
      
        data.forEach(game => {
          const month = new Date(game.DateTime).toLocaleString('default', { month: 'long' });
          const actualResult = game.FTR;
          models.forEach(model => {
            if (!accuracyByModelAndMonth[model]) {
              accuracyByModelAndMonth[model] = {};
            }
            if (!accuracyByModelAndMonth[model][month]) {
              accuracyByModelAndMonth[model][month] = { correct: 0, total: 0 };
            }
            accuracyByModelAndMonth[model][month].total += 1;
            if (game[model] === actualResult) {
              accuracyByModelAndMonth[model][month].correct += 1;
            }
          });
        });
      
        const labels = uniqueMonths;
        const datasets = models.map((model, index) => {
          const data = labels.map(month => {
            const totalPredictions = totalPredictionsByModelAndMonth[model][month] || 1;
            const accuracy = accuracyByModelAndMonth[model][month] || { correct: 0, total: 0 };
            return accuracy ? (accuracy.correct / totalPredictions) * 100 : 0;
          });
          let label = model;
          if (model === "w/o KNN") {
            label = "KNN";
          } else if (model === "vadar KNN") {
            label = "KNN + VADER";
          } else if (model === "roberta KNN") {
            label = "KNN + roBERTa";
          } else if (model === "w/o Naive Bayes") {
            label = "NB";
          } else if (model === "vadar Naive Bayes") {
            label = "NB + VADER";
          } else if (model === "roberta Naive Bayes") {
            label = "NB + roBERTa";
          } else if (model === "w/o L Regress") {
            label = "LR";
          } else if (model === "vadar L Regress") {
            label = "LR + VADER";
          } else if (model === "roberta L Regress") {
            label = "LR + roBERTa";
          } else if (model === "w/o SVM") {
            label = "SVM";
          } else if (model === "vadar SVM") {
            label = "SVM + VADER";
          } else if (model === "roberta SVM") {
            label = "SVM + roBERTa";
          } 
          return {
            label,
            data,
            fill: false,
            borderColor: getRandomColor(index),
            borderWidth: 1,
          };
        });
      
        return { labels, datasets };
      };
  
      const updateChartData = (accuracyOverTimeData) => {
        setChartData(accuracyOverTimeData);
      };
    
      const accuracyOverTimeData = processDataForTotalAccuracyOverTime(dataset, models);
      updateChartData(accuracyOverTimeData);
    }, [dataset, models]);
  
    const getRandomColor = (index) => {
      const colors = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8'];
      return colors[index % colors.length];
    };
  
    return (
      <ChartContainer title="Total Accuracy Over Time" chartData={chartData} options={{}}>
        <Line data={chartData} options={{}} />
      </ChartContainer>
    );
  };
  
  export default TotalAccuracyOverTimeChart;
