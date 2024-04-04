import React, { useState, useEffect } from 'react';

// AccuracyCard Component
const AccuracyCard = ({ modelName, accuracy }) => {
  return (
    <div className="accuracy-card">
      <h3>{modelName}</h3>
      <p>{accuracy.toFixed(2)}%</p>
    </div>
  );
};

const getNumberOfCardsToShow = (width) => {
  if (width > 1200) return 4; // large screens
  if (width > 992) return 3;  // medium screens
  if (width > 768) return 2;  // small screens
  return 2; // extra small screens
};

// ModelAccuracyCards Component
const ModelAccuracyCards = ({ dataset }) => {
  const [accuracies, setAccuracies] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [numberOfCards, setNumberOfCards] = useState(getNumberOfCardsToShow(window.innerWidth));
  const [sortOrder, setSortOrder] = useState('high-to-low'); // Default sort order

  useEffect(() => {
    const accuracyCounts = {};

    const handleResize = () => {
      setNumberOfCards(getNumberOfCardsToShow(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);

    dataset.forEach((game) => {
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

    const calculatedAccuracies = Object.keys(accuracyCounts).map(model => ({
      model,
      accuracy: (accuracyCounts[model].correct / accuracyCounts[model].total) * 100,
    }));

    const sortedAccuracies = calculatedAccuracies.sort((a, b) =>
      sortOrder === 'high-to-low' ? b.accuracy - a.accuracy : a.accuracy - b.accuracy
    );

    setAccuracies(sortedAccuracies);

    return () => window.removeEventListener('resize', handleResize);
  }, [dataset, sortOrder]);

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
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
          <AccuracyCard key={model} modelName={model} accuracy={accuracy} />
        ))}
      </div>
      <button onClick={toggleShowAll} className="full-screen-button">
        {showAll ? 'Collapse' : 'More'}
      </button>
    </div>
  );
};

export { AccuracyCard, ModelAccuracyCards };
