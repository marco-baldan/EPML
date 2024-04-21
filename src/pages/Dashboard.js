import React, { useState, useEffect } from 'react';
import TotalAccuracyOverTimeChart from '../components/charts/TotalAccuracyOverTimeChart';
import ModelGroupAccuracyChart from '../components/charts/ModelGroupAccuracyChart';
import ModelAccuracyChart from '../components/charts/ModelAccuracyChart';
import BackButton from '../components/BackButton';
import { ModelAccuracyCards } from '../components/charts/ModelAccuracyCards';
import dataset from '../data/mlmodels/collated_games_data.json';
import metricsdataset from '../data/mlmodels/merged_metrics.json';
import './Dashboard.css'; 

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
        <ModelGroupAccuracyChart dataset={dataset} />
        <ModelAccuracyCards dataset={metricsdataset} />
      </div>
    </div>
  );
};

export default Dashboard;