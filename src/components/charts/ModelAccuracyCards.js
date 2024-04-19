import React, { useState, useEffect } from 'react';
import '../../pages/Dashboard.css';

const ModelAccuracyCard = ({ modelName, accuracy }) => {
  let mainModelName = modelName.split(' ').slice(1).join(' ');
  if (mainModelName === 'L Regress') {
    mainModelName = 'Logistic regression';
  } else if (mainModelName === 'SVM') {
    mainModelName = 'Support Vector Machine';
  } else if (mainModelName === 'KNN') {
    mainModelName = 'K-Nearest Neighbours';
  }
  
  let sentimentModel = modelName.split(' ')[0];
  if (sentimentModel === 'vadar') {
    sentimentModel = 'VADER';
  } else if (sentimentModel === 'roberta') {
    sentimentModel = 'roBERTa';
  }

  return (
    <div className="accuracy-card">
      {sentimentModel === 'w/o' ? null : (
        <div className="sentiment-sticker">{sentimentModel}</div>
      )}
      <h3>{mainModelName}</h3>
      <p>{accuracy.toFixed(2)}%</p>
    </div>
  );
};


// Determine the number of accuracy cards to show based on screen width
const determineNumberOfCardsToShow = (width) => {
  if (width > 1200) return 4; 
  if (width > 992) return 3;  
  if (width > 768) return 2;  
  return 2; // Extra small screens
};

// Component for displaying accuracy of multiple models
const ModelAccuracyCards = ({ dataset }) => {
  // State variables
  const [accuracies, setAccuracies] = useState([]); // List of accuracies for models
  const [showAll, setShowAll] = useState(false);    // Toggle to show all accuracies
  const [numberOfCards, setNumberOfCards] = useState(determineNumberOfCardsToShow(window.innerWidth)); // Number of accuracy cards to display
  const [sortOrder, setSortOrder] = useState('high-to-low'); // Sort order for accuracies

  // Effect to calculate accuracies and update state
  useEffect(() => {
    const accuracyCounts = {}; // Object to store counts of correct predictions for each model

    // Handler for window resize event
    const handleResize = () => {
      setNumberOfCards(determineNumberOfCardsToShow(window.innerWidth));
    };

    window.addEventListener('resize', handleResize); // Listen for window resize events

    // Calculate accuracies from the dataset
    dataset.forEach((game) => {
      const actualResult = game.FTR; // Actual result of the game
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

    // Calculate accuracies and sort them based on sort order
    const calculatedAccuracies = Object.keys(accuracyCounts).map(model => ({
      model,
      accuracy: (accuracyCounts[model].correct / accuracyCounts[model].total) * 100, // Calculate accuracy percentage
    }));
    const sortedAccuracies = calculatedAccuracies.sort((a, b) =>
      sortOrder === 'high-to-low' ? b.accuracy - a.accuracy : a.accuracy - b.accuracy
    );

    setAccuracies(sortedAccuracies); 

    return () => window.removeEventListener('resize', handleResize); // Cleanup function to remove event listener
  }, [dataset, sortOrder]);

  // Handler for sort order change
  const handleSortChange = (event) => {
    setSortOrder(event.target.value); // Update sort order state
  };
  const toggleShowAll = () => {
    setShowAll(!showAll); 
  };

  const displayedAccuracies = showAll ? accuracies : accuracies.slice(0, numberOfCards);

  return (
    <div className={`chart-container ${showAll ? 'full-screen' : ''}`}>
      <h2 className="chart-title">Model Accuracies</h2>
      <div className='sort-label'>
        <label>Sort by: </label>
        <select onChange={handleSortChange} value={sortOrder}>
          <option value="high-to-low">High to Low</option>
          <option value="low-to-high">Low to High</option>
        </select>
      </div>
      <div className="model-accuracy-cards-container">
        {displayedAccuracies.map(({ model, accuracy }) => (
          <ModelAccuracyCard key={model} modelName={model} accuracy={accuracy} />
        ))}
      </div>
      <button onClick={toggleShowAll} className="full-screen-button">
        {showAll ? 'Collapse' : 'More'}
      </button>
    </div>
  );
};

export { ModelAccuracyCard, ModelAccuracyCards };
