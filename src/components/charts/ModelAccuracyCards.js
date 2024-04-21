import React, { useState, useEffect } from 'react';
import '../../pages/Dashboard.css';

const ModelAccuracyCard = ({ modelName, metricValue }) => {
  let mainModelName = modelName.split(' ').slice(1).join(' ');
  if (mainModelName === 'L Regress') {
    mainModelName = 'Logistic regression';
  } else if (mainModelName === 'SVM') {
    mainModelName = 'Support Vector Machine';
  } else if (mainModelName === 'KNN') {
    mainModelName = 'K-Nearest Neighbours';
  }
  
  let sentimentModel = modelName.split(' ')[0];
  if (sentimentModel === 'vader') {
    sentimentModel = 'VADER';
  } else if (sentimentModel === 'w_roberta') {
    sentimentModel = 'roBERTa';
  }
  
  const formattedMetricValue = metricValue < 0.01 ? '< 1%' : `${(metricValue * 100).toFixed(2)}`;

  return (
    <div className="accuracy-card">
      {sentimentModel === 'w/o' ? null : (
        <div className="sentiment-sticker">{sentimentModel}</div>
      )}
      <h3>{mainModelName}</h3>
      <p>{formattedMetricValue}%</p>
    </div>
  );
};

const determineNumberOfCardsToShow = (width) => {
  if (width > 1200) return 4; 
  if (width > 992) return 3;  
  if (width > 768) return 2;  
  return 2; // Extra small screens
};

const convertDatasetToArray = (dataset, selectedMetric) => {
  return Object.entries(dataset).map(([modelName, metrics]) => ({
    modelName,
    metricValue: metrics[selectedMetric]
  }));
};

const ModelAccuracyCards = ({ dataset }) => {
  const [showAll, setShowAll] = useState(false);
  const [numberOfCards, setNumberOfCards] = useState(determineNumberOfCardsToShow(window.innerWidth));
  const [sortOrder, setSortOrder] = useState('high-to-low');
  const [selectedMetric, setSelectedMetric] = useState('Accuracy');
  const [displayedMetrics, setDisplayedMetrics] = useState([]);

  useEffect(() => {
    setNumberOfCards(determineNumberOfCardsToShow(window.innerWidth));
    window.addEventListener('resize', () => {
      setNumberOfCards(determineNumberOfCardsToShow(window.innerWidth));
    });
    return () => window.removeEventListener('resize', () => {
      setNumberOfCards(determineNumberOfCardsToShow(window.innerWidth));
    });
  }, []);

  useEffect(() => {
    const sortedMetrics = convertDatasetToArray(dataset, selectedMetric).sort((a, b) => {
      const metricA = parseFloat(a.metricValue);
      const metricB = parseFloat(b.metricValue);
      return sortOrder === 'high-to-low' ? metricB - metricA : metricA - metricB;
    });

    setDisplayedMetrics(showAll ? sortedMetrics : sortedMetrics.slice(0, numberOfCards));
  }, [showAll, dataset, selectedMetric, numberOfCards, sortOrder]);

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleMetricChange = (event) => {
    setSelectedMetric(event.target.value);
  };

  const toggleShowAll = () => {
    setShowAll(prevShowAll => !prevShowAll);
  };

  return (
    <div className={`chart-container ${showAll ? 'full-screen' : ''}`}>
      <h2 className="chart-title">Model Metrics</h2>
      <div className='sort-label'>
        <label>Sort by: </label>
        <select onChange={handleSortChange} value={sortOrder}>
          <option value="high-to-low">High to Low</option>
          <option value="low-to-high">Low to High</option>
        </select>
      </div>
      <div className='sort-label'>
        <label>Select Metric: </label>
        <select onChange={handleMetricChange} value={selectedMetric}>
          <option value="Accuracy">Accuracy</option>
          <option value="Precision">Precision</option>
          <option value="Recall">Recall</option>
          <option value="F1 Score">F1 Score</option>
        </select>
      </div>
      <div className="model-accuracy-cards-container">
        {displayedMetrics.map(({ modelName, metricValue }) => (
          <ModelAccuracyCard
            key={modelName + metricValue} 
            modelName={modelName}
            metricValue={metricValue}
          />
        ))}
      </div>
      <button onClick={toggleShowAll} className="full-screen-button">
        {showAll ? 'Collapse' : 'More'}
      </button>
    </div>
  );
};

export { ModelAccuracyCard, ModelAccuracyCards };
